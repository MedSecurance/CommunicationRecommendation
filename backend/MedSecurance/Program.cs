using System.Net.Http.Headers;
using System.Reflection;
using System.Text.Json.Serialization;
using Email;
using Email.Configuration;
using Email.Extensions;
using FluentValidation;
using MedSecurance.ActivityLog;
using MedSecurance.ActivityLog.Repositories;
using MedSecurance.ActivityLog.Repositories.Interfaces;
using MedSecurance.Alerts.Extensions;
using MedSecurance.AuthUtils;
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
using MedSecurance.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
builder.Services.AddScoped<IProtocolReplacementEvaluator, ProtocolReplacementEvaluator>();
builder.Services.AddScoped<IEvidenceManagerService, EvidenceManagerService>();

builder.Services.AddTransient<IClaimsTransformation, CustomClaimsTransformation>();

builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

builder.Services.AddHttpClient("EvidenceManagerApi", client =>
{
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    client.BaseAddress = new Uri(builder.Configuration["EvidenceManagerApi:BaseUrl"] ??
                                 throw new Exception("EvidenceManagerApi:BaseUrl is null"));
});

// Add Swagger and configure the security definition for OAuth2.
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Keycloak", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Flows = new OpenApiOAuthFlows
        {
            Implicit = new OpenApiOAuthFlow
            {
                AuthorizationUrl = new Uri(builder.Configuration["Keycloak:AuthorizationUrl"]!),
                TokenUrl = new Uri(builder.Configuration["Keycloak:TokenUrl"] ?? string.Empty),
                Scopes = new Dictionary<string, string>
                {
                    { "openid", "OpenID Connect scope" },
                    { "profile", "Access profile information" }
                    // Add other scopes as required
                }
            }
        }
    });

    // Apply the security scheme globally
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Keycloak"
                },
                In = ParameterLocation.Header,
                Name = "Authorization",
                Scheme = "Bearer",
            },
            []
        }
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

// Add CORS services and define the "AllowAll" policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policies =>
    {
        policies
            .AllowAnyOrigin() // Allows all origins
            .AllowAnyMethod()
            .AllowAnyHeader(); // Allows all headers
    });
});


builder.Services.AddAuthorizationBuilder();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;

        // Keycloak's metadata URL to automatically fetch public keys and other details
        options.MetadataAddress = builder.Configuration["Keycloak:MetadataAddress"] ?? string.Empty;

        // Set the Audience, which should be the client ID of your confidential client in Keycloak
        options.Audience = builder.Configuration["Keycloak:ClientId"];

        // TokenValidationParameters
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer =
                builder.Configuration["Keycloak:Issuer"], // Typically: "http://<keycloak-server>/realms/<realm-name>"
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Keycloak:ClientId"], // Match your client ID in Keycloak
            // Accept both the frontend and backend audience
            ValidAudiences = new List<string>
                { "med-sec-portal", "client-confidential", "account" }, // Add the valid audiences here
            ValidateLifetime = true, // Validate token expiration
            ClockSkew = TimeSpan.Zero, // Optional: reduce default clock skew to zero
        };
    });


builder.Services.AddAuthorizationBuilder()
    .AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"))
    .AddPolicy("UserAdmin", policy => policy.RequireRole("Admin", "User"))
    .AddPolicy("Create", policy => policy.RequireRole("User", "Admin", "SecurityAnalyst", "RegulatoryBodies"))
    .AddPolicy("Delete", policy => policy.RequireRole("User", "Admin"))
    .AddPolicy("Update", policy => policy.RequireRole("User", "Admin"))
    .AddPolicy("View", policy => policy.RequireRole("User", "Admin", "SecurityAnalyst", "RegulatoryBodies"));
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
}

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");

    // Set up Swagger UI to use PKCE with OAuth2
    c.OAuthClientId("med-sec-portal");
    c.OAuthScopes("openid", "profile"); // Define the scopes if needed
    c.OAuthUsePkce(); // Enables PKCE
});

// Serilog logs the HTTP request response times.
app.UseSerilogRequestLogging();

app.UseHttpsRedirection();

app.AddEvaluatorEndpoints();
app.AddDevicesEndpoints();
app.AddEmailEndpoints();

app.MapGroup("activity-log")
    .MapActivityLogEndpoints()
    .WithTags("Activity Log")
    .RequireAuthorization("AdminOnly");

app.Run();