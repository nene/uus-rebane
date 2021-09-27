import { Coord, coordDistance, coordDiv, tileToScreenCoord } from "../Coord";
import { BeerBottle } from "../items/BeerBottle";
import { BottleOpener } from "../items/BottleOpener";
import { PixelScreen } from "../PixelScreen";
import { SoundLibrary } from "../SoundLibrary";
import { Sprite } from "../Sprite";
import { SpriteLibrary } from "../SpriteLibrary";
import { SpriteSheet } from "../SpriteSheet";
import { MiniGame } from "./MiniGame";

enum CaptureStatus {
  miss = 0,
  hit = 1,
}

export class OpeningGame implements MiniGame {
  private bgSprite: Sprite;
  private bottleSprite: Sprite;
  private bottleCapSprites: SpriteSheet;
  private openerSprite: Sprite;
  private bottleCoord: Coord;
  private openerCoord: Coord;
  private captureStatus = CaptureStatus.miss;
  private captureThreshold = 2;

  constructor(private bottle: BeerBottle, private opener: BottleOpener) {
    this.bgSprite = SpriteLibrary.get("opening-game-bg").getSprite([0, 0]);
    this.bottleSprite = SpriteLibrary.get("bottle-xl").getSprite([0, 0]);
    this.bottleCapSprites = SpriteLibrary.get("bottle-cap-xl");
    this.openerSprite = SpriteLibrary.get("bottle-opener-xl").getSprite([0, 0]);
    this.bottleCoord = [100, 100];
    this.openerCoord = [120, 120];
  }

  tick() {

  }

  paint(screen: PixelScreen) {
    this.drawBackground(screen);
    screen.drawSprite(this.bottleSprite, this.bottleCoord, { fixed: true });
    screen.drawSprite(this.bottleCapSprites.getSprite([this.captureStatus, 0]), this.bottleCoord, { fixed: true });
    screen.drawSprite(this.openerSprite, this.openerCoord, { fixed: true });
  }

  handleClick(coord: Coord) {
    this.openerCoord = coord;
    this.captureStatus = this.checkCaptureStatus();
    if (this.captureStatus === CaptureStatus.hit) {
      this.bottle.open();
      SoundLibrary.play("opening-beer");
    }
  }

  handleMouseMove(coord: Coord) {
    this.openerCoord = coord;
    this.captureStatus = this.checkCaptureStatus();
  }

  isFinished(): boolean {
    return this.bottle.isOpen();
  }

  private checkCaptureStatus(): CaptureStatus {
    const distance = coordDistance(this.bottleCoord, this.openerCoord);
    return distance < this.captureThreshold ? CaptureStatus.hit : CaptureStatus.miss;
  }

  private drawBackground(screen: PixelScreen) {
    const [width, height] = coordDiv(screen.getSize(), [16, 16]);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        screen.drawSprite(this.bgSprite, tileToScreenCoord([x, y]), { fixed: true });
      }
    }
  }
}
