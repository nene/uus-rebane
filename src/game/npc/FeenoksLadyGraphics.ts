import { readAsepriteAnimation } from "../sprites/readAsepriteAnimation";
import { Sprite } from "../sprites/Sprite";
import { SpriteAnimation } from "../sprites/SpriteAnimation";
import { SpriteLibrary } from "../sprites/SpriteLibrary";
import { CharacterGraphics } from "./Character";
import feenoksLadyJson from "../sprites/data/feenoks-lady.json";
import { SpriteSheet } from "../sprites/SpriteSheet";

export class FeenoksLadyGraphics implements CharacterGraphics {
  private getSpriteSheet(): SpriteSheet {
    return SpriteLibrary.get("feenoks-lady");
  }

  getDefaultSprite(): Sprite {
    return this.getSpriteSheet().getSprite([0, 0]);
  }

  getFaceSprite(): Sprite {
    return {
      ...this.getDefaultSprite(),
      coord: [0, 3],
      size: [16, 16],
      offset: [0, 0],
    };
  }

  getIdleAnimation(): SpriteAnimation {
    return new SpriteAnimation(this.getSpriteSheet(), {
      frames: readAsepriteAnimation("idle", feenoksLadyJson),
    });
  }
}
