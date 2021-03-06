import { Coord, coordAdd, coordEq, isCoordInRect, Rect, screenToTileCoord, tileToScreenCoord } from "../Coord";
import { LocationFactory, LocationName } from "./LocationFactory";
import { GameObject } from "../GameObject";
import { ObjectIndexer } from "../ObjectIndexer";
import { PathFinder } from "../PathFinder";
import { PixelScreen } from "../PixelScreen";
import { GameWorld } from "../GameWorld";
import { last } from "lodash";
import { CharacterFigure, isCharacterFigure } from "../npc/CharacterFigure";
import { Character } from "../npc/Character";
import { Particles } from "./Particles";
import { LocationBackground } from "./LocationBackground";

export interface TeleportCommand {
  entity: GameObject & { setCoord: (coord: Coord) => void };
  fromLocation: LocationName;
  toLocation: LocationName;
  coord: Coord;
}

export class Location {
  private name: LocationName;
  private backgrounds: LocationBackground[];
  private foregrounds: LocationBackground[];
  private objects: GameObject[];
  private indexer: ObjectIndexer;
  private pathFinder: PathFinder;
  private particles?: Particles;
  private isActive = false;

  constructor(private location: LocationFactory) {
    this.name = location.getName();
    this.indexer = new ObjectIndexer(screenToTileCoord(location.getSize()));
    this.backgrounds = location.getBackgrounds();
    this.foregrounds = location.getForegrounds();
    this.objects = this.location.getObjects();
    this.particles = this.location.getParticles?.();
    this.sortObjects();
    this.pathFinder = new PathFinder(this.indexer.isTileEmpty.bind(this.indexer));
  }

  getName() {
    return this.name;
  }

  getSize(): Coord {
    return this.location.getSize();
  }

  add(...objects: GameObject[]) {
    this.objects.push(...objects);
  }

  remove(object: GameObject) {
    this.objects = this.objects.filter((obj) => obj !== object);
  }

  allObjects(): GameObject[] {
    return this.objects;
  }

  tick(world: GameWorld): TeleportCommand[] {
    if (this.isActive) {
      this.particles?.tick();
    }

    const commands = [];
    for (const obj of this.objects) {
      const command = obj.tick(this, world);
      if (command) {
        commands.push(command);
      }
    }
    this.sortObjects();
    return commands;
  }

  paint(screen: PixelScreen) {
    screen.paint(this.backgrounds);
    screen.paint(this.allObjects());
    screen.paint(this.foregrounds);
    this.particles?.paint(screen);
  }

  deactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }

  private sortObjects() {
    this.objects.sort((a, b) => {
      return a.zIndex() - b.zIndex();
    });
    this.indexer.updateObjects(this.objects);
  }

  /**
   * Looks up objects based on their hitBox,
   * returns the first visible object (others might be behind it)
   */
  getObjectVisibleOnCoord(screenCoord: Coord): GameObject | undefined {
    // Loop through objects from front to back
    return [...this.objects].reverse().find((obj) => {
      const hitBox = obj.hitBox();
      const topLeft = coordAdd(obj.getCoord(), hitBox.coord);
      return isCoordInRect(screenCoord, { coord: topLeft, size: hitBox.size });
    });
  }

  getObjectsInRect(rect: Rect): GameObject[] {
    return this.indexer.getObjectsInRect(rect);
  }

  findPath(coord1: Coord, coord2: Coord): Coord[] | undefined {
    const steps = this.pathFinder.findPath(
      screenToTileCoord(coord1),
      screenToTileCoord(coord2)
    )?.map((coord) => coordAdd(tileToScreenCoord(coord), [8, 8]));

    // When last step isn't exactly at coord2, add that coord to the list of steps
    const lastStep = last(steps);
    if (lastStep && coordEq(lastStep, coord2)) {
      return steps;
    } else if (steps) {
      return [...steps, coord2];
    } else {
      return undefined;
    }
  }

  findCharacterFigure(character: Character): CharacterFigure | undefined {
    return this.allCharacterFigures()
      .find((fig) => fig.getCharacter() === character);
  }

  allCharacterFigures(): CharacterFigure[] {
    return this.allObjects().filter(isCharacterFigure);
  }
}
