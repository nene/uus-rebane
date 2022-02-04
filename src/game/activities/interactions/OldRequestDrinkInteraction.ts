import { AcademicCharacter } from "../../npc/AcademicCharacter";
import { UiController } from "../../UiController";
import { Interaction, InteractionType } from "./Interaction";
import { BeerGlass, DrinkLevel, isBeerGlass } from "../../items/BeerGlass";
import { DrinkActivity } from "./../DrinkActivity";
import { BeerBottle, isBeerBottle, isFullBeerBottle } from "../../items/BeerBottle";
import { ValidationResult } from "../../questions/Question";
import { getDrink } from "../../items/Drink";
import { GameItem } from "../../items/GameItem";
import { CharacterDialog } from "../../dialogs/CharacterDialog";

export class OldRequestDrinkInteraction implements Interaction {
  private hasReceivedBeerGlass = false;
  private dialog: CharacterDialog;

  constructor(private character: AcademicCharacter) {
    this.dialog = new CharacterDialog(character);
  }

  getType() {
    return InteractionType.beer;
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
      this.hasReceivedBeerGlass = true;
      beerBottle.empty();
      table.getInventory().add(beerBottle);
      this.character.satisfyDesire("beer");
      return true;
    }
    return false;
  }

  isFinished() {
    return this.hasReceivedBeerGlass;
  }

  interact(ui: UiController, item?: GameItem) {
    if (!item || !(isBeerBottle(item) || isBeerGlass(item))) {
      this.dialog.show(ui, "Rebane! Too mulle šoppen õlut.");
      return;
    }

    if (item.getDrink() === getDrink("water")) {
      this.dialog.show(ui, "Vett võid sa ise juua kui tahad.");
      return;
    }

    if (this.acceptDrink(ui, item)) {
      ui.getAttributes().setSelectedItem(undefined);
      this.character.setField("glass", item);
      this.character.satisfyDesire("beer");
      this.hasReceivedBeerGlass = true;
    }
  }

  private acceptDrink(ui: UiController, item: BeerGlass | BeerBottle): item is BeerGlass {
    if (isBeerGlass(item)) {
      const result = this.validateBeerGlass(item);
      this.dialog.show(ui, result.msg);

      if (result.type === "praise") {
        this.character.changeOpinion(+1);
      }
      else if (result.type === "punish") {
        this.character.changeOpinion(-1);
      }

      if (item.getLevel() > DrinkLevel.empty) {
        return true;
      } else {
        return false;
      }
    }
    else if (isBeerBottle(item) && !item.isOpen()) {
      this.dialog.show(ui, "Aitäh.\nTee palun pudel lahti ja vala šoppenisse ka.");
      return false;
    }
    else if (isBeerBottle(item) && item.isOpen()) {
      this.dialog.show(ui, "Aitäh.\nVala õlu šoppenisse ka.");
      return false;
    }
    return false;
  }

  nextActivity() {
    if (this.hasReceivedBeerGlass) {
      return new DrinkActivity(this.character);
    }
  }

  private validateBeerGlass(beerGlass: BeerGlass): ValidationResult {
    const drink = beerGlass.getDrink();
    const isFavorite = drink && this.character.getFavoriteDrinks().includes(drink);
    const isHated = drink && this.character.getHatedDrinks().includes(drink);

    switch (beerGlass.getLevel()) {
      case DrinkLevel.full:
        if (isFavorite) {
          return { type: "praise", msg: "Ooo! Täis šoppen minu lemmikõllega! Oled parim rebane." };
        } else if (isHated) {
          return { type: "punish", msg: "Uhh! Terve šoppenitäis sellist jälkust. Kao mu silmist, sa igavene!" };
        } else {
          return { type: "praise", msg: "Ooo! See on ju suurepäraselt täidetud šoppen. Oled tõega kiitust väärt." };
        }
      case DrinkLevel.almostFull:
        if (isFavorite) {
          return { type: "praise", msg: "Vau! Šoppen minu lemmikõllega! Suur aitäh!" };
        } else if (isHated) {
          return { type: "punish", msg: "Väkk, mis asi! Kas sa ise jood seda?" };
        } else {
          return { type: "neutral", msg: "Aitäh! Oled üsna tublisti valanud." };
        }
      case DrinkLevel.half:
        if (isFavorite) {
          return { type: "neutral", msg: "Oo... Minu lemmikõlu! Aga miks vaid pool šoppenit?" };
        } else if (isHated) {
          return { type: "neutral", msg: "Nojah... See pole just suurem asi... Vähemalt pole seda palju." };
        } else {
          return { type: "punish", msg: "No kuule! See on ju poolik šoppen. Mis jama sa mulle tood!" };
        }
      case DrinkLevel.almostEmpty:
        if (isFavorite) {
          return { type: "punish", msg: "Kas sa õrritad mind või? Õlu tundub hea, aga miks ainult tilk šoppeni põhjas?" };
        } else if (isHated) {
          return { type: "neutral", msg: "Einoh... Kui seda jama juua, siis rohkem kui lonksu ma ei võtakski." };
        } else {
          return { type: "punish", msg: "See ei lähe! Ma palusin sul tuua šoppeni täie õlut, aga sina tood mulle mingi tilga šoppeni põhjas." };
        }
      case DrinkLevel.empty:
        return { type: "neutral", msg: "Eee... jah, see on šoppen. Aga paluksin õlut ka siia sisse, aitäh." };
    }
  }
}