import { coordAdd, coordSub, Rect, rectGrow } from "../Coord";
import { PixelScreen } from "../PixelScreen";
import { drawInset, drawUpset, UI_BG_COLOR, UI_SHADOW_COLOR } from "../ui-utils";

export class ShopView {
  private rect: Rect = { coord: [64, 16], size: [192, 108] };
  private titleHeight = 17;

  paint(screen: PixelScreen) {
    screen.drawRect(this.rect, UI_BG_COLOR, { fixed: true });
    drawUpset(screen, this.rect);
    this.drawTitle(screen);

    drawInset(screen, this.shopListRect());
    screen.drawRect(rectGrow(this.shopListRect(), [-1, -1]), "#000", { fixed: true });
  }

  private drawTitle(screen: PixelScreen) {
    screen.drawText("Külmkapp", coordAdd(this.rect.coord, [3, 2]), { shadowColor: UI_SHADOW_COLOR });
    screen.drawText("Kui märjukest soovid, siis ka õllekassasse münt poeta.", coordAdd(this.rect.coord, [3, 12]), { size: "small" });
  }

  private shopListRect(): Rect {
    const { coord, size } = rectGrow(this.rect, [-2, -2]);
    return { coord: coordAdd(coord, [0, this.titleHeight]), size: coordSub(size, [0, this.titleHeight]) };
  }
}

