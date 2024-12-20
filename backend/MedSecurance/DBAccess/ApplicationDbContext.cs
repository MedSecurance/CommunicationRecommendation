using MedSecurance.ActivityLog.Models;
using MedSecurance.DeviceManager.Models;
using MedSecurance.ProtocolEvaluator.Configuration;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.RiskAssessment;
using MedSecurance.UserManager.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MedSecurance.DBAccess;

public class ApplicationDbContext : IdentityDbContext<User>
{
    private readonly IConfiguration _configuration;

    public DbSet<Device> Devices { get; set; }
    public DbSet<BluetoothDevice> BluetoothDevices { get; set; }
    public DbSet<WifiDevice> WifiDevices { get; set; }
    public DbSet<LorawanDevice> LorawanDevices { get; set; }
    public DbSet<GsmDevice> GsmDevices { get; set; }
    public DbSet<RiskAssessment> RiskAssessments { get; set; }
    public DbSet<AdminConfig> AdminConfigs { get; set; }
    public DbSet<ActivityLogEntity> ActivityLogsEntity { get; set; }

    public ApplicationDbContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Device>(entity =>
        {
            entity.OwnsOne(d => d.WifiSpecs);
            entity.OwnsOne(d => d.BluetoothSpecs);
            entity.OwnsOne(d => d.LorawanSpecs);
            entity.OwnsOne(d => d.GsmSpecs);
        });

        modelBuilder.Entity<AdminConfig>(entity => { entity.HasKey(e => new { e.Property, e.Protocol }); });

        base.OnModelCreating(modelBuilder);

        Task.Run(async () => await Seed(modelBuilder)).Wait();
        Task.Run(async () => await SeedAdminConfig(modelBuilder)).Wait();
    }

    private Task Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
        {
            Id = "44f1e544-9500-42e6-bcf6-c74f5cace999",
            Name = "PlatformAdmin",
            NormalizedName = "PlatformAdmin".ToUpperInvariant()
        });

        modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
        {
            Id = "998643fa-d5e2-4dff-9684-2c1ef30ce818",
            Name = "HardwareAdmin",
            NormalizedName = "HardwareAdmin".ToUpperInvariant()
        });

        modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
        {
            Id = "d38867b1-0543-4c44-ba92-1a65c4f8bc18",
            Name = "SecurityAnalyst",
            NormalizedName = "SecurityAnalyst".ToUpperInvariant()
        });

        modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
        {
            Id = "3c07ef7e-af20-46e7-8487-e7822512392b",
            Name = "RegulatoryBody",
            NormalizedName = "RegulatoryBody".ToUpperInvariant()
        });

        return Task.CompletedTask;
    }

    private Task SeedAdminConfig(ModelBuilder modelBuilder)
    {
        foreach (var protocol in Enum.GetValues(typeof(Protocol)).Cast<Protocol>())
        {
            var meanTimeToRepairInMinutes =
                _configuration.GetValue<string>($"ProtocolEvaluator:{protocol}:MeanTimeToRepairInMinutes");
            
            var meanDowntimeInMinutes =
                _configuration.GetValue<string>($"ProtocolEvaluator:{protocol}:MeanDowntimeInMinutes");
            
            var lifetimeInYears =
                _configuration.GetValue<string>($"ProtocolEvaluator:{protocol}:LifetimeInYears");

            modelBuilder.Entity<AdminConfig>().HasData(new AdminConfig()
            {
                Protocol = protocol,
                Property = "MeanTimeToRepairInMinutes",
                Value = meanTimeToRepairInMinutes
            });

            modelBuilder.Entity<AdminConfig>().HasData(new AdminConfig()
            {
                Protocol = protocol,
                Property = "MeanDowntimeInMinutes",
                Value = meanDowntimeInMinutes
            });
            
            modelBuilder.Entity<AdminConfig>().HasData(new AdminConfig()
            {
                Protocol = protocol,
                Property = "LifetimeInYears",
                Value = lifetimeInYears
            });
        }

        return Task.CompletedTask;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseNpgsql(_configuration.GetConnectionString("DefaultConnection"));
    }
}