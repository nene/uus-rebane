import { Coord, Rect } from "./Coord";
import { GameObject } from "./GameObject";
import { GameWorld } from "./GameWorld";
import { PixelScreen } from "./PixelScreen";
import { Sprite } from "./sprites/Sprite";
import { UiController } from "./UiController";
import { Character } from "./npc/Character";
import { Desires } from "./npc/Desires";

export class Bursh implements GameObject {
  private desires: Desires;
  private sprites: Sprite[] = [];

  constructor(private coord: Coord, private character: Character) {
    this.desires = new Desires(character);
  }

  getName() {
    return this.character.name;
  }

  tick(world: GameWorld) {
    const activity = this.desires.currentActivity();

    const updates = activity.tick(this.coord, world);
    if (updates.coord) {
      this.coord = updates.coord;
    }
    this.sprites = updates.sprites || [];
  }

  paint(screen: PixelScreen) {
    this.sprites.forEach((sprite) => {
      screen.drawSprite(sprite, this.coord);
    });
  }

  zIndex() {
    return this.coord[1];
  }

  getCoord() {
    return this.coord;
  }

  isSolid() {
    return false;
  }

  hitBox(): Rect {
    return { coord: [-7, -29], size: [14, 30] };
  }

  boundingBox(): Rect {
    return { coord: [-8, -3], size: [16, 5] };
  }

  onInteract(uiController: UiController) {
    const activity = this.desires.currentActivity();
    activity.interact(uiController);
  }
}
