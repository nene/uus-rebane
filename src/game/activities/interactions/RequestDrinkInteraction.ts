import { AcademicCharacter } from "../../npc/AcademicCharacter";
import { UiApi } from "../../UiController";
import { Interaction } from "./Interaction";
import { GameItem } from "../../items/GameItem";
import { CharacterDialog } from "../../dialogs/CharacterDialog";
import { CallFuxActivity } from "../CallFuxActivity";
import { OpenBottleInteraction } from "./OpenBottleInteraction";
import { BeerBottle, isFullBeerBottle } from "../../items/BeerBottle";
import { CalloutSpriteFactory, InteractionType } from "./CalloutSpriteFactory";
import { pickRandom } from "../../utils/pickRandom";

export class RequestDrinkInteraction implements Interaction {
  private beerBottle?: BeerBottle;
  private dialog: CharacterDialog;

  constructor(private character: AcademicCharacter) {
    this.dialog = new CharacterDialog(character);
  }

  getCalloutSprites() {
    return [
      CalloutSpriteFactory.getSprite(InteractionType.bottle),
      CalloutSpriteFactory.getBottleSprite(pickRandom(this.character.getValidDrinks())),
    ];
  }

  tryComplete(): boolean {
    const table = this.character.getField("table");
    if (!table) {
      throw new Error("Can't perform RequestDrinkInteraction when not sitting at table.");
    }
    const beerGlass = this.character.getField("glass");
    if (!beerGlass) {
      throw new Error("Can't perform RequestDrinkInteraction when no BeerGlass already at hand.");
    }

    const beerBottle = table.getInventory().takeFirstOfKind(this.isDesiredBottle.bind(this));
    if (beerBottle) {
      this.beerBottle = beerBottle;
      return true;
    }
    return false;
  }

  private isDesiredBottle(item: GameItem): item is BeerBottle {
    return isFullBeerBottle(item) && this.character.validateDrink(item.getDrink()).type !== "punish";
  }

  isFinished() {
    return Boolean(this.beerBottle);
  }

  interact(ui: UiApi, item?: GameItem) {
    if (!item || !isFullBeerBottle(item)) {
      this.dialog.show(ui, "Rebane! Õlut!");
      return;
    }
    const result = this.character.validateDrink(item.getDrink());
    if (result.type === "punish") {
      this.dialog.show(ui, result.msg);
      return;
    }

    ui.getAttributes().setSelectedItem(undefined);
    if (result.type === "praise") {
      this.dialog.show(ui, result.msg);
    }
    this.beerBottle = item;
  }

  nextActivity() {
    if (this.beerBottle) {
      return new CallFuxActivity(this.character, new OpenBottleInteraction(this.character, this.beerBottle));
    }
  }
}
