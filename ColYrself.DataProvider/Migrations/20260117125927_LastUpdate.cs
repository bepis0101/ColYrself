using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ColYrself.DataProvider.Migrations
{
    /// <inheritdoc />
    public partial class LastUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Room_meetings_MeetingId",
                table: "Room");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomUser_Room_RoomId",
                table: "RoomUser");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomUser_users_UserId",
                table: "RoomUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RoomUser",
                table: "RoomUser");

            migrationBuilder.DropIndex(
                name: "IX_RoomUser_UserId",
                table: "RoomUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Room",
                table: "Room");

            migrationBuilder.RenameTable(
                name: "RoomUser",
                newName: "RoomUsers");

            migrationBuilder.RenameTable(
                name: "Room",
                newName: "Rooms");

            migrationBuilder.RenameIndex(
                name: "IX_RoomUser_RoomId",
                table: "RoomUsers",
                newName: "IX_RoomUsers_RoomId");

            migrationBuilder.RenameIndex(
                name: "IX_Room_MeetingId",
                table: "Rooms",
                newName: "IX_Rooms_MeetingId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RoomUsers",
                table: "RoomUsers",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Rooms",
                table: "Rooms",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_RoomUsers_UserId",
                table: "RoomUsers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_meetings_MeetingId",
                table: "Rooms",
                column: "MeetingId",
                principalTable: "meetings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomUsers_Rooms_RoomId",
                table: "RoomUsers",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomUsers_users_UserId",
                table: "RoomUsers",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_meetings_MeetingId",
                table: "Rooms");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomUsers_Rooms_RoomId",
                table: "RoomUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomUsers_users_UserId",
                table: "RoomUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RoomUsers",
                table: "RoomUsers");

            migrationBuilder.DropIndex(
                name: "IX_RoomUsers_UserId",
                table: "RoomUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Rooms",
                table: "Rooms");

            migrationBuilder.RenameTable(
                name: "RoomUsers",
                newName: "RoomUser");

            migrationBuilder.RenameTable(
                name: "Rooms",
                newName: "Room");

            migrationBuilder.RenameIndex(
                name: "IX_RoomUsers_RoomId",
                table: "RoomUser",
                newName: "IX_RoomUser_RoomId");

            migrationBuilder.RenameIndex(
                name: "IX_Rooms_MeetingId",
                table: "Room",
                newName: "IX_Room_MeetingId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RoomUser",
                table: "RoomUser",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Room",
                table: "Room",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_RoomUser_UserId",
                table: "RoomUser",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Room_meetings_MeetingId",
                table: "Room",
                column: "MeetingId",
                principalTable: "meetings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomUser_Room_RoomId",
                table: "RoomUser",
                column: "RoomId",
                principalTable: "Room",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomUser_users_UserId",
                table: "RoomUser",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
