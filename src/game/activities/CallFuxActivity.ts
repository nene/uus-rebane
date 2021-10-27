import { Coord, coordAdd } from "../Coord";
import { Activity, ActivityUpdates } from "./Activity";
import { Sprite } from "../sprites/Sprite";
import { SpriteLibrary } from "../sprites/SpriteLibrary";
import { Character } from "../npc/Character";
import { UiController } from "../UiController";
import { Interaction } from "./Interaction";
import { GameWorld } from "../GameWorld";

export class CallFuxActivity implements Activity {
  private counter = 0;
  private sprite: Sprite;
  private calloutSprite: Sprite;

  constructor(private character: Character, private interaction: Interaction) {
    this.sprite = SpriteLibrary.getSprite(character.getSpriteSet());
    this.calloutSprite = SpriteLibrary.getSprite("callout", [interaction.getType(), 0]);
  }

  tick(): ActivityUpdates {
    this.counter++;
    return {
      sprites: [
        this.sprite,
        this.translateSprite(this.calloutSprite, this.spriteOffset())
      ],
    };
  }

  private translateSprite(sprite: Sprite, offset: Coord): Sprite {
    return {
      ...sprite,
      offset: coordAdd(sprite.offset, offset),
    };
  }

  private spriteOffset(): Coord {
    const sinX = Math.sin(Math.PI * ((this.counter % 11) / 10));
    return [0, sinX * 4];
  }

  isFinished() {
    return this.interaction.isFinished();
  }

  isInteractable() {
    return true;
  }

  interact(ui: UiController, world: GameWorld) {
    this.interaction.interact(ui, world);
  }

  nextActivity() {
    if (this.interaction.isFinished()) {
      return this.interaction.nextActivity();
    }
  }
}
