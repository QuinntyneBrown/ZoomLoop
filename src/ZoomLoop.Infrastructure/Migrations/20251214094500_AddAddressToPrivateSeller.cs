using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZoomLoop.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAddressToPrivateSeller : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddressLine1",
                table: "PrivateSellers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AddressLine2",
                table: "PrivateSellers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "PrivateSellers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Province",
                table: "PrivateSellers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "PrivateSellers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "PrivateSellers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddressLine1",
                table: "PrivateSellers");

            migrationBuilder.DropColumn(
                name: "AddressLine2",
                table: "PrivateSellers");

            migrationBuilder.DropColumn(
                name: "City",
                table: "PrivateSellers");

            migrationBuilder.DropColumn(
                name: "Province",
                table: "PrivateSellers");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "PrivateSellers");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "PrivateSellers");
        }
    }
}
