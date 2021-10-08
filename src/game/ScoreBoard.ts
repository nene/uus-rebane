import { times } from "lodash";
import { Coord, coordAdd } from "./Coord";
import { BeerLevel } from "./items/BeerGlass";
import { PixelScreen } from "./PixelScreen";
import { Sprite } from "./sprites/Sprite";
import { SpriteLibrary } from "./sprites/SpriteLibrary";
import { SpriteSheet } from "./sprites/SpriteSheet";
import { Wallet } from "./Wallet";

export class ScoreBoard {
  private bg: Sprite;
  private beerGlass: SpriteSheet;

  constructor(private coord: Coord, private wallet: Wallet) {
    this.bg = SpriteLibrary.get("scoreboard").getSprite([0, 0]);
    this.beerGlass = SpriteLibrary.get("beer-glass-sm");
  }

  paint(screen: PixelScreen) {
    screen.drawSprite(this.bg, this.coord);
    this.drawWallet(screen);
    this.drawAlcoholLevel(screen);
  }

  private drawWallet(screen: PixelScreen) {
    screen.drawText(this.wallet.getMoney(), coordAdd(this.coord, [39, 1]), { align: "right", shadowColor: "#8f563b" });
  }

  private drawAlcoholLevel(screen: PixelScreen) {
    times(5, (i: number) => {
      const level = i > 2 ? BeerLevel.full : BeerLevel.empty;
      screen.drawSprite(this.beerGlass.getSprite([level, 0]), coordAdd(this.coord, [5 + i * 9, 29]));
    });
  }
}
