import { Coord, coordAdd, coordSub, isCoordInRect, Rect, rectGrow } from "../Coord";
import { GameEvent } from "../GameEvent";
import { BeerBottle } from "../items/BeerBottle";
import { PixelScreen } from "../PixelScreen";
import { drawInset, drawUpset, UI_BG_COLOR, UI_SHADOW_COLOR } from "../ui-utils";
import { ScrollView } from "./ScrollView";
import { Shop } from "../inventory/Shop";
import { ShopItemRenderer } from "./ShopItemRenderer";
import { InventoryView } from "../inventory/InventoryView";

export class ShopView implements InventoryView {
  private rect: Rect = { coord: [64, 16], size: [192, 108] };
  private titleHeight = 17;
  private shopItemRenderer: ShopItemRenderer;
  private scrollView: ScrollView<BeerBottle>;

  constructor(shop: Shop) {
    this.shopItemRenderer = new ShopItemRenderer();
    this.scrollView = new ScrollView({
      items: shop.allItems(),
      rect: rectGrow(this.shopListRect(), [-1, -1]),
      itemSize: [this.rect.size[0] - 16, 20],
      itemSeparator: 1,
      margin: [1, 1],
      bgColor: "#000",
      renderer: this.shopItemRenderer.render.bind(this.shopItemRenderer),
    });
  }

  handleGameEvent(event: GameEvent): boolean | undefined {
    return this.scrollView.handleGameEvent(event);
  }

  paint(screen: PixelScreen) {
    this.drawBackground(screen);
    this.drawTitle(screen);
    this.scrollView.paint(screen);
  }

  isCoordInView(coord: Coord): boolean {
    return isCoordInRect(coord, this.rect);
  }

  getSlotIndexAtCoord(coord: Coord): number {
    return this.scrollView.getItemIndexAtCoord(coord);
  }

  private drawBackground(screen: PixelScreen) {
    screen.drawRect(this.rect, UI_BG_COLOR);
    drawUpset(screen, this.rect);
    drawInset(screen, this.shopListRect());
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

