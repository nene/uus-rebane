import { Coord, isCoordInRect } from "../Coord";
import { GameEvent } from "../GameEvent";
import { PixelScreen } from "../PixelScreen";
import { ScrollView } from "../ui/ScrollView";
import { Shop } from "./Shop";
import { ShopItemRenderer } from "./ShopItemRenderer";
import { InventoryView, ItemHoverHandler, SlotClickHandler } from "./InventoryView";
import { Wallet } from "../Wallet";
import { Headline, Window } from "../ui/Window";
import { GameItem } from "../items/GameItem";

interface ShopViewConfig {
  shop: Shop;
  wallet: Wallet;
  headline: Headline;
  onClose: () => void;
}

export class ShopView implements InventoryView {
  private shopItemRenderer: ShopItemRenderer;
  private scrollView: ScrollView<GameItem>;
  private window: Window;
  private shop: Shop;
  private handleSlotClick?: SlotClickHandler;
  private handleItemHover?: ItemHoverHandler;

  constructor({ shop, wallet, headline, onClose }: ShopViewConfig) {
    this.shop = shop;

    this.window = new Window({
      size: [192, 129],
      headline,
      onClose,
    });

    const contentRect = this.window.contentAreaRect();

    this.shopItemRenderer = new ShopItemRenderer(wallet);
    this.scrollView = new ScrollView({
      items: shop.allItems(),
      rect: contentRect,
      itemSize: [contentRect.size[0] - 10, 20],
      itemSeparator: 1,
      margin: [1, 1],
      bgColor: "#000",
      renderer: this.shopItemRenderer.render.bind(this.shopItemRenderer),
    });
  }

  onSlotClick(cb: SlotClickHandler) {
    this.handleSlotClick = cb;
  }

  onItemHover(cb: ItemHoverHandler) {
    this.handleItemHover = cb;
  }

  getInventory() {
    return this.shop;
  }

  handleGameEvent(event: GameEvent): boolean | undefined {
    const stopPropagation =
      this.window.handleGameEvent(event) ||
      this.scrollView.handleGameEvent(event);
    if (stopPropagation) {
      return true;
    }

    switch (event.type) {
      case "click": return this.handleClick(event.coord);
      case "mousemove": return this.handleMouseMove(event.coord);
    }
  }

  private handleClick(coord: Coord): boolean | undefined {
    const slotIndex = this.getSlotIndexAtCoord(coord);
    if (slotIndex !== -1) {
      this.handleSlotClick && this.handleSlotClick(slotIndex, this.shop.itemAt(slotIndex));
      return true;
    }
    return isCoordInRect(coord, this.window.getRect());
  }

  private handleMouseMove(coord: Coord): boolean | undefined {
    const item = this.shop.itemAt(this.getSlotIndexAtCoord(coord));
    if (item) {
      this.handleItemHover && this.handleItemHover(coord, item);
      return true;
    }
    return undefined;
  }

  paint(screen: PixelScreen) {
    this.window.paint(screen);
    this.scrollView.paint(screen);
  }

  getSlotIndexAtCoord(coord: Coord): number {
    return this.scrollView.getItemIndexAtCoord(coord);
  }
}

