import { Sprite } from "../sprites/Sprite";
import { SpriteLibrary } from "../sprites/SpriteLibrary";
import { CharacterGraphics } from "./Character";
import { Facing } from "../npc/Facing";
import { DrinkAnimationSprites } from "../sprites/DrinkAnimation";
import { FramesDef } from "../sprites/SpriteAnimation";
import { readAsepriteAnimation } from "../sprites/readAsepriteAnimation";
import { AcademicCharacterDef } from "./AcademicCharacter";
import { SpriteSheet } from "../sprites/SpriteSheet";

interface DrinkAnimationSpriteConfig {
  sprites: DrinkAnimationSprites;
  idleTicks: number;
  drinkTicks: number;
}

export class AcademicCharacterGraphics implements CharacterGraphics {
  constructor(private def: AcademicCharacterDef) {
  }

  getSpriteName() {
    return this.def.spriteName;
  }

  private getSpriteSheet(): SpriteSheet {
    return SpriteLibrary.get(this.getSpriteName());
  }

  getDefaultSprite(): Sprite {
    return this.getSpriteSheet().getSprite([0, 0]);
  }

  getFaceSprite(): Sprite {
    // Extract the upper portion (face) of the first sprite
    return {
      ...this.getDefaultSprite(),
      coord: [0, 3],
      size: [16, 16],
      offset: [0, 0],
    };
  }

  getMoveAnimationFrames(): Record<Facing, FramesDef> {
    return this.def.moveAnimationFrames ?? {
      up: [[0, 0]],
      down: [[0, 0]],
      left: [[0, 0]],
      right: [[0, 0]],
    };
  }

  getDrinkAnimationConfig(): DrinkAnimationSpriteConfig {
    return {
      sprites: this.getDrinkSprites(),
      ...(this.def.drinkingSpeed ?? { idleTicks: 30, drinkTicks: 10 }),
    };
  }

  private getDrinkSprites(): DrinkAnimationSprites {
    const drinkFrames = readAsepriteAnimation("B", this.def.json);
    const [figure1, figure2, hand] = drinkFrames.length === 3 ? [0, 1, 2] : [0, 0, 1];
    return {
      figure1: this.getSpriteSheet().getSprite(drinkFrames[figure1].coord),
      figure2: this.getSpriteSheet().getSprite(drinkFrames[figure2].coord),
      hand: this.getSpriteSheet().getSprite(drinkFrames[hand].coord),
    }
  }

  getGreetAnimationFrames(): FramesDef {
    try {
      return readAsepriteAnimation("greet", this.def.json);
    } catch (e) {
      return [[0, 0]];
    }
  }
}
