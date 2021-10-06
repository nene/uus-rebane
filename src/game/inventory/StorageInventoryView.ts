import { Coord, Rect } from "../Coord";
import { PixelScreen } from "../PixelScreen";
import { Inventory } from "./Inventory";
import { InventoryView } from "./InventoryView";
import { Headline, Window } from "../ui/Window";
import { GridInventoryView } from "./GridInventoryView";

interface StorageInventoryViewCfg {
  inventory: Inventory;
  rect: Rect;
  headline: Headline;
  size: Coord;
}

// Shows inventory grid inside window
export class StorageInventoryView implements InventoryView {
  private window: Window;
  private grid: GridInventoryView;

  constructor({ inventory, rect, size, headline }: StorageInventoryViewCfg) {
    this.window = new Window({ headline, rect });
    this.grid = new GridInventoryView({ inventory, coord: this.window.contentAreaRect().coord, size });
  }

  paint(screen: PixelScreen) {
    this.window.paint(screen);
    this.grid.paint(screen);
  }

  handleGameEvent() {
    return undefined;
  }

  isCoordInView(coord: Coord): boolean {
    return this.window.isCoordInView(coord);
  }

  getSlotIndexAtCoord(coord: Coord): number {
    return this.grid.getSlotIndexAtCoord(coord);
  }
}
