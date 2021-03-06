import { Coord, coordEq, coordMul, coordUnit, coordSub, coordAdd } from "../Coord";
import { Location } from "../locations/Location";
import { AcademicCharacter } from "../npc/AcademicCharacter";
import { CharacterFigure } from "../npc/CharacterFigure";
import { Facing, headingToFacing } from "../npc/Facing";
import { SpriteAnimation } from "../sprites/SpriteAnimation";
import { Activity, ActivityUpdates } from "./Activity";

export class MoveActivity implements Activity {
  private speed: Coord = [0, 0];
  private path?: Coord[];
  private moveAnimations: Record<Facing, SpriteAnimation>;
  private finished = false;

  constructor(private destination: Coord, character: AcademicCharacter) {
    this.moveAnimations = character.getGraphics().getMoveAnimations();
  }

  public tick(figure: CharacterFigure, location: Location): ActivityUpdates {
    const coord = figure.getCoord();

    if (coordEq(coord, this.destination)) {
      this.finished = true;
      return { sprites: this.tickAnimationAndGetSprites() };
    }

    const targetCoord = this.getActivePathStep(coord, location);
    if (targetCoord) {
      this.speed = this.getSpeed(coord, targetCoord);
      return { coord: coordAdd(coord, this.speed), sprites: this.tickAnimationAndGetSprites() };
    }

    this.finished = true;
    return { sprites: this.tickAnimationAndGetSprites() };
  }

  private tickAnimationAndGetSprites() {
    const animation = this.moveAnimations[headingToFacing(this.speed)];
    animation.tick();
    return animation.getSprites();
  }

  public isFinished() {
    return this.finished;
  }

  private getSpeed(coord: Coord, targetCoord: Coord): Coord {
    const dirVector = coordSub(targetCoord, coord);
    if (Math.abs(dirVector[0]) <= 1 && Math.abs(dirVector[1]) <= 1) {
      return coordUnit(dirVector);
    } else {
      return coordMul(coordUnit(dirVector), [2, 2]);
    }
  }

  private getActivePathStep(coord: Coord, location: Location): Coord | undefined {
    if (this.destination && !this.path) {
      this.path = location.findPath(coord, this.destination);
    }
    const current = this.path?.[0];
    if (current && coordEq(coord, current)) {
      this.path?.shift();
      return this.path?.[0];
    }
    return current;
  }

  isInteractable() {
    return false;
  }

  interact() { }

  nextActivity() {
    return undefined;
  }
}
