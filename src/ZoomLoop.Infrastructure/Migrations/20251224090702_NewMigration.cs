// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZoomLoop.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NewMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Fix duplicate empty email addresses by assigning unique temporary emails
            migrationBuilder.Sql(@"
                WITH DuplicateEmails AS (
                    SELECT UserId,
                           ROW_NUMBER() OVER (PARTITION BY ISNULL(Email, '') ORDER BY UserId) as RowNum
                    FROM Users
                    WHERE Email IS NULL OR Email = ''
                )
                UPDATE Users
                SET Email = 'temp_' + CAST(de.UserId AS NVARCHAR(50)) + '@placeholder.local'
                FROM Users u
                INNER JOIN DuplicateEmails de ON u.UserId = de.UserId
                WHERE de.RowNum > 0
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
