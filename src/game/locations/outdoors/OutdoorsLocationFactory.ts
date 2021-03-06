import { Coord, tileToScreenCoord } from "../../Coord";
import { LocationFactory, LocationName } from "../LocationFactory";
import { GameObject } from "../../GameObject";
import { TiledLevelFactory } from "../TiledLevelFactory";
import { getLevel } from "../Level";
import { LeavesFalling } from "../LeavesFalling";

export class OutdoorsLocationFactory implements LocationFactory {
  private levelFactory = new TiledLevelFactory(getLevel("Outdoors"));
  private objects: GameObject[];

  constructor() {
    this.objects = [
      ...this.levelFactory.getWalls(),
      ...this.levelFactory.getFurniture(),
      // A spawn location outside of the fence
      // new SpawnPoint(tileToScreenCoord([14, 15])),
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
      this.levelFactory.getBackground(),
      this.levelFactory.getGrass(),
      this.levelFactory.getBuildingsBackground(),
    ];
  }

  getForegrounds() {
    return [this.levelFactory.getBuildingsForeground()];
  }

  getObjects() {
    return this.objects;
  }

  getParticles() {
    return new LeavesFalling();
  }
}
