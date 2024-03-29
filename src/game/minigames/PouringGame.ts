import { PlayerAttributes } from "../attributes/PlayerAttributes";
import { Coord, coordAdd, coordDiv, coordMul, coordSub, isCoordInRect, Rect } from "../Coord";
import { GameEvent } from "../GameEvent";
import { BeerBottle } from "../items/BeerBottle";
import { BeerGlass, DrinkLevel } from "../items/BeerGlass";
import { PixelScreen } from "../PixelScreen";
import { SoundLibrary } from "../sounds/SoundLibrary";
import { Sprite } from "../sprites/Sprite";
import { SpriteAnimation } from "../sprites/SpriteAnimation";
import { SpriteLibrary } from "../sprites/SpriteLibrary";
import { SCREEN_SIZE } from "../ui/screen-size";
import { Noise } from "../utils/Noise";
import { MiniGame } from "./MiniGame";
import { PouringLogic } from "./PouringLogic";

const GLASS_COORD: Coord = [136, 98];
const MIN_LEVEL: Coord = [136, 176];
const MAX_LEVEL: Coord = [136, 105];
const MAX_BEER_HEIGHT = MIN_LEVEL[1] - MAX_LEVEL[1];
const POURING_AREA: Rect = { coord: [136, 0], size: [47, 98] };
const GLASS_AREA: Rect = { coord: [129, 92], size: [49 + 36, 78 + 6] };
const TABLE_TOP = 170;
const BEER_COLOR = "rgba(245, 209, 153, 0.70)";
const DEBUG = false;

const HAND_NOISE_SCALE = 10;
const HAND_MAX_SHAKE: Coord = [40, 25]; // +/- movement in each direction: ;

export class PouringGame implements MiniGame {
  private sprites: Record<"bg" | "table" | "bottle" | "beerGlass" | "beerFoam", Sprite>;
  private beerAnimation: SpriteAnimation;

  private bottleCoord: Coord;
  private mouseDown = false;
  private clicksAfterFinished = 0;
  private pouring: PouringLogic;
  private tickCounter = 0;
  private noise = new Noise();
  private beerOnTable: Record<number, number> = {};
  private handShakeAmount = 0;
  private attributes?: PlayerAttributes;

  constructor(private glass: BeerGlass, private bottle: BeerBottle) {
    this.sprites = {
      bg: SpriteLibrary.getSprite("cfe-bg-lg"),
      table: SpriteLibrary.getSprite("opening-game-bg"),
      bottle: SpriteLibrary.getSprite("bottle-xl"),
      beerGlass: SpriteLibrary.getSprite("beer-glass-xl"),
      beerFoam: SpriteLibrary.getSprite("beer-foam-xl"),
    };

    this.beerAnimation = new SpriteAnimation(SpriteLibrary.get("beer-xl"), { frames: { from: [0, 0], to: [14, 0] } });
    this.bottleCoord = [0, 0];
    this.pouring = new PouringLogic(bottle.getDrink().foam);
  }

  init(attributes: PlayerAttributes) {
    this.handShakeAmount = attributes.alcoSkill.getHandShakeAmount();
    this.attributes = attributes;
  }

  tick() {
    this.tickCounter++;
    this.beerAnimation.tick();

    if (this.isFlowing()) {
      if (this.isPouringToGlass()) {
        this.pouring.pourToGlass(this.getFlowRate());
      } else {
        this.pouring.pourToGround(this.getFlowRate());
        this.addToTable(this.getFlowRate(), this.adjustedBottleCoord());
      }
    }
    if (this.isFinished()) {
      this.bottle.empty();
      this.glass.fill(this.bottle.getDrink(), this.getBeerLevel());
      this.attributes?.pouringSkill.pourDrink();
    }
  }

  private addToTable(rate: number, coord: Coord) {
    const x = Math.floor(coord[0] / 8) * 8;
    this.beerOnTable[x] = (this.beerOnTable[x] || 0) + rate;
  }

  private isPouringToGlass(): boolean {
    return isCoordInRect(this.adjustedBottleCoord(), POURING_AREA);
  }

  private getBeerLevel(): DrinkLevel {
    if (this.pouring.getTotalInGlass() > 0.9) {
      return DrinkLevel.full;
    }
    if (this.pouring.getTotalInGlass() > 0.75) {
      return DrinkLevel.almostFull;
    }
    if (this.pouring.getTotalInGlass() > 0.5) {
      return DrinkLevel.half;
    }
    if (this.pouring.getTotalInGlass() > 0.25) {
      return DrinkLevel.almostEmpty;
    }
    return DrinkLevel.empty;
  }

  paint(screen: PixelScreen) {
    screen.withFixedCoords(() => {
      this.drawBackground(screen);
      if (this.isFlowing()) {
        screen.drawRect({ coord: coordAdd(this.adjustedBottleCoord(), [-1, -1]), size: [Math.ceil(this.getFlowRate() * 6), 200] }, "rgba(252,225,180,185)");
      }
      screen.drawSprite(this.sprites.bottle, this.adjustedBottleCoord());

      const beerHeight = Math.floor(this.pouring.getLiquidInGlass() * MAX_BEER_HEIGHT);
      const foamHeight = Math.floor(this.pouring.getFoamInGlass() * MAX_BEER_HEIGHT);

      screen.drawSprite(this.sprites.beerFoam, coordSub(MIN_LEVEL, [0, foamHeight + beerHeight]));
      screen.drawSprites(this.beerAnimation.getSprites(), coordSub(MIN_LEVEL, [0, beerHeight]));

      this.drawTable(screen);
      this.drawBeerOnTable(screen);
      screen.drawSprite(this.sprites.beerGlass, GLASS_COORD);

      screen.drawText("Pudelis veel: " + Math.round(this.pouring.getLiquidInBottle() * 100) + "%", [200, 5], { color: "#fff", shadowColor: "#000" });
      screen.drawText("Šoppen täis: " + Math.round(this.pouring.getFillLevel() * 100) + "%", [200 - 6, 16], { color: "#fff", shadowColor: "#000" });
      if (DEBUG) {
        screen.drawText("Vaht: " + Math.round(this.pouring.getFoamInGlass() * 100) + "%", [200 - 6, 26]);
        screen.drawText("Vedelik: " + Math.round(this.pouring.getLiquidInGlass() * 100) + "%", [200 - 6, 36]);
        screen.drawText("Flow: " + Math.round(this.getFlowRate() * 100) + "%", [200 - 6, 46]);
      }
    });
  }

  private adjustedBottleCoord() {
    let coord = coordAdd(this.bottleCoord, this.bottleOffset());
    if (coord[1] > TABLE_TOP) {
      coord = [coord[0], TABLE_TOP];
    }
    if (isCoordInRect(coord, GLASS_AREA)) {
      return this.moveCoordOutOfRect(coord, GLASS_AREA);
    }
    return coord;
  }

  private moveCoordOutOfRect(coord: Coord, rect: Rect): Coord {
    const r1 = rect.coord;
    const r2 = coordAdd(rect.coord, rect.size);

    const toLeft = coord[0] - r1[0];
    const toRight = r2[0] - coord[0];
    const toTop = coord[1] - r1[1];
    if (toLeft < toRight && toLeft < toTop) {
      return [r1[0], coord[1]];
    }
    else if (toRight < toLeft && toRight < toTop) {
      return [r2[0], coord[1]];
    }
    else {
      return [coord[0], r1[1]];
    }
  }

  private bottleOffset(): Coord {
    const shake = coordMul(HAND_MAX_SHAKE, [this.handShakeAmount, this.handShakeAmount]);
    const scale = HAND_NOISE_SCALE / this.handShakeAmount;
    const noiseCoord = this.noise.coord(this.tickCounter / scale);
    return coordMul(noiseCoord, shake).map(Math.floor) as Coord;
  }

  handleGameEvent({ type, coord }: GameEvent): boolean | undefined {
    switch (type) {
      case "click": return this.handleClick();
      case "mousemove": this.bottleCoord = coord; break;
      case "mousedown": this.handleMouseDown(); break;
      case "mouseup": this.mouseDown = false; break;
    }
    return undefined;
  }

  private handleClick() {
    if (this.pouring.isFinished()) {
      this.clicksAfterFinished++;
    }
    return true;
  }

  private handleMouseDown() {
    this.mouseDown = true;
    if (this.isFlowing()) {
      SoundLibrary.play("pouring-beer");
    }
  }

  private isFlowing(): boolean {
    return this.mouseDown && !this.pouring.isFinished();
  }

  private getFlowRate(): number {
    const glassTop = GLASS_COORD[1] - 8;
    const bottleY = this.adjustedBottleCoord()[1];
    const ceilingY = 32;
    if (bottleY >= glassTop) {
      return 0.01;
    }
    if (bottleY <= ceilingY) {
      return 1;
    }

    const range = glassTop - ceilingY;
    const bottlePos = bottleY - ceilingY;
    return Math.max(0.01, 1 - bottlePos / range);
  }

  isFinished(): boolean {
    return this.clicksAfterFinished >= 2;
  }

  private drawBackground(screen: PixelScreen) {
    this.fillWithTiles(screen, this.sprites.bg, { coord: [0, 0], size: [SCREEN_SIZE[0], 176] });
  }

  private drawTable(screen: PixelScreen) {
    this.fillWithTiles(screen, this.sprites.table, { coord: [0, 176], size: [SCREEN_SIZE[0], 24] });
  }

  private fillWithTiles(screen: PixelScreen, sprite: Sprite, rect: Rect) {
    const [width, height] = coordDiv(rect.size, sprite.size);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        screen.drawSprite(sprite, coordAdd(rect.coord, coordMul([x, y], sprite.size)));
      }
    }
  }

  private drawBeerOnTable(screen: PixelScreen) {
    const len = SCREEN_SIZE[0];
    for (let i = 0; i < len; i += 8) {
      const amount = this.beerOnTable[i];
      if (amount) {
        const size = amount * 10;
        screen.drawRect({ coord: [i - Math.floor(size / 2), 176], size: [size, size] }, BEER_COLOR);
      }
    }
  }
}
