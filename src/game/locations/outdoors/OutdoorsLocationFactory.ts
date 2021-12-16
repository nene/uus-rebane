import { Coord, tileToScreenCoord } from "../../Coord";
import { LocationFactory, LocationName } from "../LocationFactory";
import { GameObject } from "../../GameObject";
import { OutdoorsBackground } from "./OutdoorsBackground";
import { CfeBuilding } from "./CfeBuilding";
import { Building } from "./Building";
import { Door } from "../../furniture/Door";
import { Fence, FenceType } from "../../furniture/Fence";
import { SpawnPoint } from "../../furniture/SpawnPoint";
import { TiledLevelFactory } from "../TiledLevelFactory";
import { getLevel } from "../Level";

export class OutdoorsLocationFactory implements LocationFactory {
  private levelFactory = new TiledLevelFactory(getLevel("Outdoors"));
  private background: OutdoorsBackground;
  private objects: GameObject[];
  private buildings: Building[];

  constructor() {
    this.buildings = [
      new CfeBuilding([29, 64]),
    ];

    this.background = new OutdoorsBackground();

    this.objects = [
      ...this.levelFactory.getWalls(),
      ...this.buildings.flatMap((building) => building.getWalls()),
      new Door({
        coord: [229, 173 + 32],
        spriteName: "cfe-building-door",
        from: "outdoors",
        to: "cfe-hall",
      }),
      new Fence(tileToScreenCoord([1, 16]), FenceType.cfe),
      new Fence(tileToScreenCoord([5, 16]), FenceType.cfe),
      new Fence(tileToScreenCoord([9, 16]), FenceType.cfe),
      new Fence(tileToScreenCoord([16, 16]), FenceType.cfe),
      new Fence(tileToScreenCoord([23, 16]), FenceType.sakala),
      new Fence(tileToScreenCoord([27, 16]), FenceType.sakala),
      new Fence(tileToScreenCoord([31, 16]), FenceType.sakala),

      // A spawn location outside of the fence
      new SpawnPoint(tileToScreenCoord([14, 15])),
    ];
  }

  getName(): LocationName {
    return "outdoors";
  }

  getSize(): Coord {
    return tileToScreenCoord(this.levelFactory.getGridSize());
  }

  getBackgrounds() {
    return [
      this.background,
      this.levelFactory.getBackground(),
      this.levelFactory.getBuildings(),
    ];
  }

  getForeground() {
    return undefined;
  }

  getObjects() {
    return this.objects;
  }
}
