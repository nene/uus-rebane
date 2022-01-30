import { AcademicCharacter } from "../../npc/AcademicCharacter";
import { isFullBeerBottle } from "../../items/BeerBottle";
import { DrinkLevel } from "../../items/BeerGlass";
import { DrinkActivity } from "../DrinkActivity";
import { Completion } from "./Completion";

export class DrinkFromTableCompletion implements Completion {
  private completed = false;

  constructor(private character: AcademicCharacter) {
  }

  tryComplete(): boolean {
    const table = this.character.getField("table");
    if (!table) {
      throw new Error("Can't perform DrinkFromTable completion when not sitting at table.");
    }
    const beerGlass = this.character.getField("glass");
    if (!beerGlass) {
      throw new Error("Can't perform DrinkFromTable completion when no BeerGlass already at hand.");
    }

    const beerBottle = table.getInventory().takeFirstOfKind(isFullBeerBottle);
    if (beerBottle) {
      beerBottle.open();
      beerGlass.fill(beerBottle.getDrink(), DrinkLevel.full);
      this.completed = true;
      beerBottle.empty();
      table.getInventory().add(beerBottle);
      this.character.satisfyDesire("beer");
      return true;
    }
    return false;
  }

  isComplete() {
    return this.completed;
  }

  nextActivity() {
    if (this.completed) {
      return new DrinkActivity(this.character);
    }
  }
}
