import { Animation } from "../sprites/Animation";
import { CompositeAnimation } from "../sprites/CompositeAnimation";
import { SpriteAnimation } from "../sprites/SpriteAnimation";
import { SpriteLibrary } from "../sprites/SpriteLibrary";
import { Facing } from "../npc/Facing";
import cfeRebJson from "../sprites/data/cfe-reb.json";
import cfeRebDrunkJson from "../sprites/data/cfe-reb-drunk.json";
import { readAsepriteAnimation } from "../sprites/readAsepriteAnimation";

export type PlayerAnimationType = 'stand' | 'walk' | 'drunk';

export class PlayerAnimationLibrary {
  private standAnimations: Record<Facing, SpriteAnimation>;
  private walkAnimations: Record<Facing, SpriteAnimation>;
  private drunkAnimation: Animation;
  private sleepAnimation: Animation;

  constructor() {
    this.standAnimations = {
      down: new SpriteAnimation(SpriteLibrary.get("cfe-reb"), {
        frames: readAsepriteAnimation("idle", cfeRebJson),
      }),
      up: new SpriteAnimation(SpriteLibrary.get("cfe-reb"), {
        frames: readAsepriteAnimation("U", cfeRebJson),
      }),
      right: new SpriteAnimation(SpriteLibrary.get("cfe-reb"), {
        frames: readAsepriteAnimation("R", cfeRebJson),
      }),
      left: new SpriteAnimation(SpriteLibrary.get("cfe-reb"), {
        frames: readAsepriteAnimation("L", cfeRebJson),
      }),
    }

    this.walkAnimations = {
      down: new SpriteAnimation(SpriteLibrary.get("cfe-reb"), {
        frames: readAsepriteAnimation("w-down", cfeRebJson),
      }),
      up: new SpriteAnimation(SpriteLibrary.get("cfe-reb"), {
        frames: readAsepriteAnimation("w-up", cfeRebJson),
      }),
      right: new SpriteAnimation(SpriteLibrary.get("cfe-reb"), {
        frames: readAsepriteAnimation("w-right", cfeRebJson),
      }),
      left: new SpriteAnimation(SpriteLibrary.get("cfe-reb"), {
        frames: readAsepriteAnimation("w-left", cfeRebJson),
      }),
    };

    this.drunkAnimation = this.createDrunkAnimation();

    this.sleepAnimation = new CompositeAnimation([
      this.createDrunkAnimation(1),
      new SpriteAnimation(SpriteLibrary.get("cfe-reb-drunk"), {
        frames: readAsepriteAnimation("sleep", cfeRebDrunkJson),
      }),
    ]);
  }

  private createDrunkAnimation(repeat?: number): Animation {
    return new SpriteAnimation(SpriteLibrary.get("cfe-reb-drunk"), {
      frames: readAsepriteAnimation("stand", cfeRebDrunkJson),
      repeat,
    });
  }

  getStanding(facing: Facing, frame: number = 0): Animation {
    return resetFrame(this.standAnimations[facing]);
  }

  getWalking(facing: Facing, frame: number = 0): Animation {
    return this.walkAnimations[facing];
  }

  getDrunk(): Animation {
    return this.drunkAnimation;
  }

  getSleep(): Animation {
    return this.sleepAnimation;
  }
}

function resetFrame(animation: SpriteAnimation): SpriteAnimation {
  animation.setFrame(0);
  return animation;
}
