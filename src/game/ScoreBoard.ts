import { times } from "lodash";
import { Coord, coordAdd, rectAlign } from "./Coord";
import { DrinkColor } from "./items/Drink";
import { DrinkLevel } from "./items/BeerGlass";
import { PixelScreen } from "./PixelScreen";
import { Sprite } from "./sprites/Sprite";
import { SpriteLibrary } from "./sprites/SpriteLibrary";
import { SpriteSheet } from "./sprites/SpriteSheet";
import { DateTime } from "./Calendar";
import { SCREEN_RECT } from "./ui/screen-size";
import { Component } from "./ui/Component";

export class ScoreBoard implements Component {
  private bg: Sprite;
  private beerGlass: SpriteSheet;
  private coord: Coord;
  private money = 0;
  private drunkenness = 0;
  private date: DateTime = { day: 0, time: 0 };

  constructor() {
    this.bg = SpriteLibrary.getSprite("scoreboard");
    this.beerGlass = SpriteLibrary.get("beer-glass-sm");
    this.coord = rectAlign({ coord: [0, 0], size: this.bg.size }, SCREEN_RECT, "top-right").coord;
  }

  paint(screen: PixelScreen) {
    screen.drawSprite(this.bg, this.coord);
    this.drawCalendar(screen);
    this.drawWallet(screen);
    this.drawAlcoholLevel(screen);
  }

  handleGameEvent() {
    return undefined;
  }

  setMoney(money: number) {
    this.money = money;
  }

  setDrunkenness(drunkenness: number) {
    this.drunkenness = drunkenness;
  }

  setDateTime(date: DateTime) {
    this.date = date;
  }

  private drawCalendar(screen: PixelScreen) {
    screen.drawText(`${this.date.day}. päev`, coordAdd(this.coord, [6, 0]), { size: "small" });
    screen.drawText(`kell ${this.date.time}`, coordAdd(this.coord, [6, 6]), { size: "small" });
  }

  private drawWallet(screen: PixelScreen) {
    screen.drawText(this.money, coordAdd(this.coord, [39, 14]), { align: "right", shadowColor: "#8f563b" });
  }

  private drawAlcoholLevel(screen: PixelScreen) {
    times(5, (i: number) => {
      const level = this.getDrinkLevelForStep(4 - i);
      screen.drawSprite(this.beerGlass.getSprite([level, DrinkColor.light]), coordAdd(this.coord, [3 + i * 9, 24]));
    });
  }

  // drunkenness level goes: 0...5
  // steps go: 0..4
  private getDrinkLevelForStep(levelStep: number): DrinkLevel {
    const diff = this.drunkenness - levelStep;
    if (diff >= 1) {
      return DrinkLevel.full;
    }
    if (diff >= 0.75) {
      return DrinkLevel.almostFull;
    }
    if (diff >= 0.5) {
      return DrinkLevel.half;
    }
    if (diff >= 0.25) {
      return DrinkLevel.almostEmpty;
    }
    else {
      return DrinkLevel.empty;
    }
  }
}
