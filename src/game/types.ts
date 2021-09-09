import { Coord } from "./Coord";
import { PixelScreen } from "./PixelScreen";

export interface GameObject {
  coord: Coord;
  tick: (screen: PixelScreen) => void;
  paint: (screen: PixelScreen) => void;
}
