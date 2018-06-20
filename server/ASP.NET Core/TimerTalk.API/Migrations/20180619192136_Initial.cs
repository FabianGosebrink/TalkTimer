using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TimerTalk.API.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Talks",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Added = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Talks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TimerTicks",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Topic = table.Column<string>(nullable: true),
                    intervalSeconds = table.Column<int>(nullable: false),
                    secondsLeft = table.Column<int>(nullable: false),
                    TalkId = table.Column<int>(nullable: false),
                    TalkId1 = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimerTicks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TimerTicks_Talks_TalkId1",
                        column: x => x.TalkId1,
                        principalTable: "Talks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TimerTicks_TalkId1",
                table: "TimerTicks",
                column: "TalkId1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TimerTicks");

            migrationBuilder.DropTable(
                name: "Talks");
        }
    }
}
