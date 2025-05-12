using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedSecurance.Migrations
{
    /// <inheritdoc />
    public partial class AddActivityLogUserFullNameColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserFullName",
                table: "ActivityLogsEntity",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserFullName",
                table: "ActivityLogsEntity");
        }
    }
}
