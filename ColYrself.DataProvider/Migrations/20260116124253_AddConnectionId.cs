using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ColYrself.DataProvider.Migrations
{
    /// <inheritdoc />
    public partial class AddConnectionId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ConnectionId",
                table: "RoomUser",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConnectionId",
                table: "RoomUser");
        }
    }
}
