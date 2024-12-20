using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedSecurance.Migrations
{
    /// <inheritdoc />
    public partial class ModifyMacaddressProp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MacAddress",
                table: "Devices");

            migrationBuilder.AddColumn<string>(
                name: "MacAddress",
                table: "WifiDevices",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MacAddress",
                table: "LorawanDevices",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MacAddress",
                table: "GsmDevices",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MacAddress",
                table: "BluetoothDevices",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MacAddress",
                table: "WifiDevices");

            migrationBuilder.DropColumn(
                name: "MacAddress",
                table: "LorawanDevices");

            migrationBuilder.DropColumn(
                name: "MacAddress",
                table: "GsmDevices");

            migrationBuilder.DropColumn(
                name: "MacAddress",
                table: "BluetoothDevices");

            migrationBuilder.AddColumn<string>(
                name: "MacAddress",
                table: "Devices",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
