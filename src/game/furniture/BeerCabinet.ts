import { Coord, Rect } from "../Coord";
import { GameObject } from "../GameObject";
import { Inventory } from "../Inventory";
import { PixelScreen } from "../PixelScreen";
import { Sprite } from "../Sprite";
import { SpriteLibrary } from "../SpriteLibrary";
import { BeerGlass, BeerLevel } from "../items/BeerGlass";
import { UiController } from "../UiController";
import { SoundLibrary } from "../SoundLibrary";

export class BeerCabinet implements GameObject {
  private sprite: Sprite;
  private inventory: Inventory;

  constructor(private coord: Coord) {
    this.sprite = SpriteLibrary.get("beer-cabinet").getSprite([0, 0]);
    this.inventory = new Inventory({
      size: [3, 3],
      items: [
        new BeerGlass(BeerLevel.empty),
        new BeerGlass(BeerLevel.empty),
        new BeerGlass(BeerLevel.empty),
        new BeerGlass(BeerLevel.empty),
        new BeerGlass(BeerLevel.empty),
        new BeerGlass(BeerLevel.empty),
      ],
    });
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

  tileSize(): Coord {
    return [2, 1];
  }

  hitBox(): Rect {
    return { coord: [0, -32], size: [32, 45] };
  }

  boundingBox(): Rect {
    return { coord: [0, 0], size: [32, 13] };
  }

  onInteract(ui: UiController) {
    SoundLibrary.play('opening-cabinet-door');
    ui.showInventory(this.inventory, "Shoppeniriiul");
  }
}