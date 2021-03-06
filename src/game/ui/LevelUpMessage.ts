import { LevelUpEvent } from "../attributes/Skill";
import { Coord, coordAdd, isCoordInRect, Rect, rectGrow } from "../Coord";
import { GameEvent } from "../GameEvent";
import { PixelScreen, TextStyle } from "../PixelScreen";
import { readAsepriteAnimation } from "../sprites/readAsepriteAnimation";
import { SpriteAnimation } from "../sprites/SpriteAnimation";
import { SpriteLibrary } from "../sprites/SpriteLibrary";
import { Component } from "./Component";
import levelUpJson from "../sprites/data/level-up.json";
import { Sprite } from "../sprites/Sprite";
import { debounce } from "lodash";
import { Subject } from "rxjs";

const TEXT_COLOR = "#3e2821";
const BG_COLOR = "#c8b997";

const POSITION: Coord = [12, 7];
const INDENT: Coord = [6, 0];
const PADDING: Coord = [3, 1];
const BORDER_PADDING: Coord = [4, 2];

export class LevelUpMessage implements Component {
  private message?: { icon: Sprite, text: string };
  private state: "fade-in" | "fade-out" | "static" = "static";
  private animation = new SpriteAnimation(SpriteLibrary.get("level-up"), {
    frames: readAsepriteAnimation("bounce", levelUpJson),
  });
  private opacity = 0;
  private borderRect?: Rect;

  public click$ = new Subject<void>();

  private hideMessageAfterDelay = debounce(() => {
    this.state = "fade-out";
  }, 10000);

  show({ skill, msg }: LevelUpEvent) {
    this.message = {
      icon: skill.getIcon(),
      text: msg,
    };
    this.opacity = 0;
    this.state = "fade-in";
    this.hideMessageAfterDelay();
  }

  handleGameEvent(event: GameEvent) {
    if (event.type === "click" && this.borderRect && isCoordInRect(event.coord, this.borderRect)) {
      this.click$.next();
      return true;
    }
    return undefined;
  };

  tick() {
    if (this.message) {
      if (this.state === "fade-in") {
        this.opacity += 0.1;
        if (this.opacity >= 1) {
          this.state = "static";
        }
      }
      else if (this.state === "fade-out") {
        this.opacity -= 0.1;
        if (this.opacity <= 0) {
          this.state = "static";
          this.message = undefined;
        }
      }
      this.animation.tick();
    }
  }

  paint(screen: PixelScreen) {
    const message = this.message;
    if (!message) {
      return;
    }

    screen.withOpacity(this.opacity, () => {
      const style: TextStyle = { color: TEXT_COLOR, size: "small" };
      const textSize = coordAdd(screen.measureText(message.text, style), INDENT);

      this.borderRect = rectGrow({ coord: POSITION, size: textSize }, BORDER_PADDING);
      screen.drawRect(this.borderRect, TEXT_COLOR);
      screen.drawRect(rectGrow({ coord: POSITION, size: textSize }, PADDING), BG_COLOR);
      screen.drawText(message.text, coordAdd(POSITION, INDENT), style);

      screen.drawSprite(message.icon, coordAdd(this.borderRect.coord, [-6, -1]));
      screen.drawSprites(this.animation.getSprites(), coordAdd(this.borderRect.coord, [1, -3]));
    });
  }
}
