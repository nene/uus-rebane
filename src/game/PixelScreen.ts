import { Coord, coordAdd, coordConstrain, coordDiv, coordSub, Rect, rectOverlaps } from "./Coord";
import { Location } from "./locations/Location";
import { Sprite } from "./sprites/Sprite";
import { TextMeasurer } from "./ui/fitText";
import { SCREEN_SCALE, SCREEN_SIZE } from "./ui/screen-size";

export interface TextStyle {
  color?: string;
  size?: "small" | "medium";
  align?: "center" | "end" | "left" | "right" | "start";
  shadowColor?: string;
}

export class PixelScreen implements TextMeasurer {
  private ctx: CanvasRenderingContext2D;
  private size: Coord = SCREEN_SIZE;
  private offset: Coord = [0, 0];
  private bg?: ImageData;
  private fixed = false;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.ctx.scale(SCREEN_SCALE, SCREEN_SCALE);
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.textBaseline = "top";
  }

  withFixedCoords(fn: () => void) {
    const oldFixed = this.fixed;
    this.fixed = true;
    fn();
    this.fixed = oldFixed;
  }

  drawSprite(sprite: Sprite, coord: Coord) {
    const screenOffset: Coord = this.fixed ? [0, 0] : this.offset;

    if (rectOverlaps({ coord: coordAdd(coord, sprite.offset), size: sprite.size }, { coord: screenOffset, size: this.size })) {
      const adjustedCoord = coordSub(coordAdd(coord, sprite.offset), screenOffset);
      this.ctx.drawImage(
        sprite.image,
        sprite.coord[0],
        sprite.coord[1],
        sprite.size[0],
        sprite.size[1],
        adjustedCoord[0],
        adjustedCoord[1],
        sprite.size[0],
        sprite.size[1]
      );
    }
  }

  drawRect(rect: Rect, fill: string | CanvasPattern) {
    const screenOffset: Coord = this.fixed ? [0, 0] : this.offset;

    const adjustedCoord = coordSub(rect.coord, screenOffset);
    this.ctx.fillStyle = fill;
    this.ctx.fillRect(adjustedCoord[0], adjustedCoord[1], rect.size[0], rect.size[1]);
  }

  withClippedRegion({ coord, size }: Rect, fn: () => void) {
    this.ctx.save();
    this.ctx.rect(coord[0], coord[1], size[0], size[1]);
    this.ctx.clip();
    fn();
    this.ctx.restore();
  }

  drawText(text: string | number, coord: Coord, style: TextStyle = {}) {
    // We're using 9px font, but we're better off leaving 1px extra room at the top
    // so that if we want to pad the text we can add the same amount of room to each side.
    const fixedCoord = coordAdd(coord, [0, 1]);

    if (style.shadowColor) {
      this.setTextStyle({ ...style, color: style.shadowColor });
      this.ctx.fillText(String(text), fixedCoord[0] + 0.5, fixedCoord[1] + 0.5);
    }
    this.setTextStyle(style);
    this.ctx.fillText(String(text), fixedCoord[0], fixedCoord[1]);
  }

  measureText(text: string | number, style: TextStyle = {}): Coord {
    this.setTextStyle(style);
    // for some reason the text is measured 1px larger than it actually is
    const { width } = this.ctx.measureText(String(text));
    return [width - 1, style.size === "small" ? 5 : 10]; // Report 9px font as 10px (see comment above)
  }

  private setTextStyle({ size, color, align }: TextStyle) {
    if (size === "small") {
      this.ctx.font = "4.5px NineteenNinetySix";
    } else {
      this.ctx.font = "9px NineteenNinetySix";
    }
    this.ctx.fillStyle = color ?? "#000";
    this.ctx.textAlign = align ?? "left";
  }

  saveBg() {
    this.bg = this.ctx.getImageData(0, 0, this.size[0] * SCREEN_SCALE, this.size[1] * SCREEN_SCALE);
  }

  centerTo(coord: Coord, location: Location) {
    const halfScreenSize: Coord = coordDiv(this.size, [2, 2]);

    this.offset = coordConstrain(
      coordSub(coord, halfScreenSize),
      { coord: [0, 0], size: coordSub(location.getSize(), this.size) },
    );
  }

  restoreBg() {
    if (this.bg) {
      this.ctx.putImageData(this.bg, 0, 0);
    }
  }

  getOffset(): Coord {
    return this.offset;
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
