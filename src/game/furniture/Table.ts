import { Coord, Rect } from "../Coord";
import { GameObject } from "../GameObject";
import { PixelScreen } from "../PixelScreen";
import { Sprite } from "../Sprite";
import { SpriteLibrary } from "../SpriteLibrary";

export class Table implements GameObject {
  private sprite: Sprite;

  constructor(private coord: Coord) {
    this.sprite = SpriteLibrary.get("table").getSprite([0, 0]);
  }

  tick() { }

  paint(screen: PixelScreen) {
    screen.drawSprite(this.sprite, this.coord);
  }

  zIndex() {
    return this.coord[1];
  }

  getCoord() {
    return this.coord;
  }

  isSolid() {
    return true;
  }

  hitBox(): Rect {
    return { coord: [0, -6], size: [64, 17] };
  }

  boundingBox(): Rect {
    return { coord: [0, 0], size: [64, 16] };
  }

  onInteract() { }
}
