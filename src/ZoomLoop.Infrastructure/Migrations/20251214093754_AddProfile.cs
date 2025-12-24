// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZoomLoop.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Profiles",
                columns: table => new
                {
                    ProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProfileImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HomeAddress_Address1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HomeAddress_Address2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HomeAddress_City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HomeAddress_Province = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HomeAddress_PostalCode = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profiles", x => x.ProfileId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_CurrentProfileId",
                table: "Users",
                column: "CurrentProfileId",
                unique: true,
                filter: "[CurrentProfileId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Profiles_CurrentProfileId",
                table: "Users",
                column: "CurrentProfileId",
                principalTable: "Profiles",
                principalColumn: "ProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Profiles_CurrentProfileId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Profiles");

            migrationBuilder.DropIndex(
                name: "IX_Users_CurrentProfileId",
                table: "Users");
        }
    }
}
