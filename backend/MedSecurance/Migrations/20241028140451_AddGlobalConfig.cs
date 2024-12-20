using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MedSecurance.Migrations
{
    /// <inheritdoc />
    public partial class AddGlobalConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdminConfigs",
                columns: table => new
                {
                    Protocol = table.Column<int>(type: "integer", nullable: false),
                    Property = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminConfigs", x => new { x.Property, x.Protocol });
                });

            migrationBuilder.InsertData(
                table: "AdminConfigs",
                columns: new[] { "Property", "Protocol", "Value" },
                values: new object[,]
                {
                    { "LifetimeInYears", 0, "24" },
                    { "LifetimeInYears", 1, "10" },
                    { "LifetimeInYears", 2, "10" },
                    { "LifetimeInYears", 3, "10" },
                    { "MeanDowntimeInMinutes", 0, "30" },
                    { "MeanDowntimeInMinutes", 1, "30" },
                    { "MeanDowntimeInMinutes", 2, "30" },
                    { "MeanDowntimeInMinutes", 3, "30" },
                    { "MeanTimeToRepairInMinutes", 0, "5" },
                    { "MeanTimeToRepairInMinutes", 1, "5" },
                    { "MeanTimeToRepairInMinutes", 2, "5" },
                    { "MeanTimeToRepairInMinutes", 3, "5" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminConfigs");
        }
    }
}
