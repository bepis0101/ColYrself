using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ColYrself.DataProvider.Migrations.Meeting
{
    /// <inheritdoc />
    public partial class FixDbErrorsMeetings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_meetings_User_organizerId",
                table: "meetings");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropIndex(
                name: "IX_meetings_organizerId",
                table: "meetings");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    email = table.Column<string>(type: "TEXT", nullable: false),
                    username = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_meetings_organizerId",
                table: "meetings",
                column: "organizerId");

            migrationBuilder.AddForeignKey(
                name: "FK_meetings_User_organizerId",
                table: "meetings",
                column: "organizerId",
                principalTable: "User",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
