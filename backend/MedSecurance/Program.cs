using System.Text.Json.Serialization;
using Email;
using Email.Configuration;
using Email.Extensions;
using MedSecurance.ActivityLog;
using MedSecurance.ActivityLog.Repositories;
using MedSecurance.ActivityLog.Repositories.Interfaces;
using MedSecurance.Alerts.Extensions;
using MedSecurance.DBAccess;
using MedSecurance.DeviceManager;
using MedSecurance.DeviceManager.Repositories;
using MedSecurance.DeviceManager.Repositories.Interfaces;
using MedSecurance.ProtocolEvaluator;
using MedSecurance.ProtocolEvaluator.Configuration;
using MedSecurance.ProtocolEvaluator.Evaluators;
using MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;
using MedSecurance.ProtocolEvaluator.Repository;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;
using MedSecurance.UserManager;
using MedSecurance.UserManager.Configuration;
using MedSecurance.UserManager.IdentityOverrides;
using MedSecurance.UserManager.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Serilog;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>();

builder.Services.AddEndpointsApiExplorer()
    .ConfigureHttpJsonOptions(options =>
        options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Add Swagger and configure the security definition for OAuth2.
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

builder.Services.AddHttpContextAccessor();

// Add MediatR and register the services from the current assembly.
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    cfg.RegisterServicesFromAssembly(typeof(IEmailClient).Assembly);
});

builder.Services.Configure<ProtocolEvaluatorConfig>(
    builder.Configuration.GetSection(ProtocolEvaluatorConfig.ProtocolEvaluator)
);

builder.Services.Configure<EmailConfig>(
    builder.Configuration.GetSection(EmailConfig.Email)
);

builder.Services.Configure<DefaultPlatformAdminConfig>(
    builder.Configuration.GetSection(DefaultPlatformAdminConfig.DefaultPlatformAdmin)
);

builder.Services.AddScoped<IDeviceRepository, DeviceRepository>();
builder.Services.AddScoped<IWifiEvaluator, WifiEvaluator>();
builder.Services.AddScoped<IBluetoothEvaluator, BluetoothEvaluator>();
builder.Services.AddScoped<ILorawanEvaluator, LorawanEvaluator>();
builder.Services.AddScoped<IRiskAssessmentRepository, RiskAssessmentRepository>();
builder.Services.AddScoped<IAdminConfigRepository, AdminConfigRepository>();
builder.Services.AddScoped<IActivityLogRepository, ActivityLogRepository>();
builder.Services.AddEmailClient();
builder.Services.AddAlerts(builder.Configuration);
builder.Services.AddScoped<IGsmEvaluator, GsmEvaluator>();

builder.Services
    .AddIdentityCore<User>(opts =>
    {
        opts.Lockout.AllowedForNewUsers = false;

        // TODO
        // Rethink about the value of this, because when the
        // User->AccessFailedCount it reaches MaxFailedAccessAttempts
        // its value resets to 0 and it will send again alert for
        // the next 3 failed login attempts and it will keep doing that
        opts.Lockout.MaxFailedAccessAttempts = 1000;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders()
    .AddApiEndpoints();

builder.Services.AddScoped<SignInManager<User>, CustomSignInManager>();

// Add CORS services and define the "AllowAll" policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policies =>
    {
        policies.AllowAnyOrigin() // Allows all origins
            .AllowAnyMethod()
            .AllowAnyHeader(); // Allows all headers
    });
});

builder.Services.AddAuthentication()
    .AddBearerToken(IdentityConstants.BearerScheme);
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("RequirePlatformAdminRole", policy => policy.RequireRole("PlatformAdmin"));

// Use Serilog as the logging provider.
builder.Host.UseSerilog((context, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration));

builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();

    var defaultPlatformAdminConfig =
        scope.ServiceProvider.GetRequiredService<IOptions<DefaultPlatformAdminConfig>>().Value;
    DbInitializer.EnsurePlatformAdminUser(dbContext, defaultPlatformAdminConfig);
}

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// Serilog logs the HTTP request response times.
app.UseSerilogRequestLogging();

app.UseHttpsRedirection();

app.MapGroup("account")
    .MapIdentityApi<User>()
    .WithTags("Account");

app.MapGroup("user")
    .MapUserEndpoints()
    .RequireAuthorization("RequirePlatformAdminRole")
    .WithTags("User Manager");

app.AddEvaluatorEndpoints();
app.AddDevicesEndpoints();
app.AddEmailEndpoints();

app.MapGroup("activity-log")
    .MapActivityLogEndpoints()
    .WithTags("Activity Log")
    .RequireAuthorization();

app.Run();