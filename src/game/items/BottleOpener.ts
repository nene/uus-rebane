import { SoundLibrary } from "../SoundLibrary";
import { Sprite } from "../Sprite";
import { SpriteLibrary } from "../SpriteLibrary";
import { BeerBottle } from "./BeerBottle";
import { GameItem } from "./GameItem";

export class BottleOpener implements GameItem {
  private sprite: Sprite;

  constructor(sprites: SpriteLibrary, private sounds: SoundLibrary) {
    this.sprite = sprites.get("bottle-opener").getSprite([0, 0]);
  }

  getName() {
    return "Pudeliavaja";
  }

  getSprite(): Sprite {
    return this.sprite;
  }

  combine(item: GameItem): GameItem[] {
    if (item instanceof BeerBottle) {
      item.open();
      this.sounds.play("opening-beer");
      return [this, item];
    }
    return [];
  }
}
