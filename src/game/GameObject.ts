import { Coord, Rect } from "./Coord";
import { GameWorld } from "./GameWorld";
import { GameItem } from "./items/GameItem";
import { Location, TeleportCommand } from "./locations/Location";
import { PixelScreen } from "./PixelScreen";
import { UiApi } from "./UiController";

export interface GameObject {
  zIndex: () => number;
  getCoord: () => Coord;
  paint: (screen: PixelScreen) => void;
  tick: (location: Location, world: GameWorld) => void | TeleportCommand;
  isSolid: () => boolean;
  hitBox: () => Rect;
  boundingBox: () => Rect;
  interact: (ui: UiApi, item?: GameItem) => void;
  isInteractable: (ui: UiApi, item?: GameItem) => boolean;
}
