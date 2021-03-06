import { Coord, coordAdd, screenToTileCoord } from "../Coord";
import { PixelScreen } from "../PixelScreen";
import { SpriteLibrary, SpriteName } from "../sprites/SpriteLibrary";
import { SpriteSheet } from "../sprites/SpriteSheet";
import { LocationBackground } from "./LocationBackground";
import { Tile } from "./Level";

export class TiledBackground implements LocationBackground {
  private bg: SpriteSheet;

  constructor(private tiles: Tile[], spriteName: SpriteName, private offset: Coord = [0, 0]) {
    this.bg = SpriteLibrary.get(spriteName);
  }

  paint(screen: PixelScreen) {
    for (const tile of this.tiles) {
      screen.drawSprite(this.bg.getSprite(screenToTileCoord(tile.src)), coordAdd(tile.px, this.offset));
    }
  }
}
