import { BeerCabinet } from "../../furniture/BeerCabinet";
import { Coord, tileToScreenCoord } from "../../Coord";
import { Fridge } from "../../furniture/Fridge";
import { LocationFactory, LocationName } from "../LocationFactory";
import { GameObject } from "../../GameObject";
import { Table } from "../../furniture/Table";
import { BeerBox } from "../../furniture/BeerBox";
import { Door } from "../../furniture/Door";
import { Sofa } from "../../furniture/Sofa";
import { Fireplace } from "../../furniture/Fireplace";
import { Countertop } from "../../furniture/Countertop";
import { KitchenSink } from "../../furniture/KitchenSink";
import { BookCabinet } from "../../furniture/BookCabinet";
import { getLevel } from "../Level";
import { TiledLevelFactory } from "../TiledLevelFactory";

export class CfeCellarLocationFactory implements LocationFactory {
  private levelFactory = new TiledLevelFactory(getLevel("CFE_cellar"));

  private objects: GameObject[] = [
    ...this.levelFactory.getWalls(),
    ...this.levelFactory.getFurniture(),

    new Table(tileToScreenCoord([8, 8])),
    new Table(tileToScreenCoord([3, 8]), "rtl"),
    new Sofa(tileToScreenCoord([3, 4])),
    new Fireplace(tileToScreenCoord([6, 4])),
    new BookCabinet(tileToScreenCoord([10, 4])),
    new Door({
      coord: tileToScreenCoord([12, 4]),
      spriteName: "staircase-door",
      spriteCoord: [1, 0],
      from: "cfe-cellar",
      to: "cfe-hall",
      teleportOffset: [16, -8],
    }),

    new Countertop(tileToScreenCoord([15, 7])),
    new BeerCabinet(tileToScreenCoord([17, 7])),
    new Fridge(tileToScreenCoord([19, 7])),
    new BeerBox(tileToScreenCoord([20, 7])),
    new KitchenSink(tileToScreenCoord([21, 8])),
  ];

  getName(): LocationName {
    return "cfe-cellar";
  }

  getSize(): Coord {
    return tileToScreenCoord(this.levelFactory.getGridSize());
  }

  getBackground() {
    return this.levelFactory.getBackground();
  }

  getForeground() {
    return this.levelFactory.getForeground();
  }

  getObjects() {
    return this.objects;
  }
}
