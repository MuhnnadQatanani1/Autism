using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Autsim.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureOneToOneCascadeDeleteg : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PecsImage");

            migrationBuilder.CreateTable(
                name: "PecsImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImageData = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    PecsCardID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PecsImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PecsImages_PecsCards_PecsCardID",
                        column: x => x.PecsCardID,
                        principalTable: "PecsCards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PecsImages_PecsCardID",
                table: "PecsImages",
                column: "PecsCardID",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PecsImages");

            migrationBuilder.CreateTable(
                name: "PecsImage",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    pecsid = table.Column<int>(type: "int", nullable: true),
                    ImageData = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    PecsCardID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PecsImage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PecsImage_PecsCards_pecsid",
                        column: x => x.pecsid,
                        principalTable: "PecsCards",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PecsImage_pecsid",
                table: "PecsImage",
                column: "pecsid",
                unique: true,
                filter: "[pecsid] IS NOT NULL");
        }
    }
}
