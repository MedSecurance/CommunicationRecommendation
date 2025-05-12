using MedSecurance.ActivityLog.Models;
using MedSecurance.DeviceManager.Models;
using MedSecurance.ProtocolEvaluator.Configuration;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.RiskAssessment;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MedSecurance.DBAccess;

public class ApplicationDbContext : DbContext
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

        Task.Run(async () => await SeedAdminConfig(modelBuilder)).Wait();
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