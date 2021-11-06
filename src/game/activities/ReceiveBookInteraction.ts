import { showPlainTextDialog } from "../dialogs/showPlainTextDialog";
import { GameWorld } from "../GameWorld";
import { Book } from "../items/Book";
import { getDrink } from "../items/Drink";
import { Character } from "../npc/Character";
import { UiController } from "../UiController";
import { Activity } from "./Activity";
import { CallFuxActivity } from "./CallFuxActivity";
import { RequestWaterInteraction } from "./RequestWaterInteraction";

type InteractionResult = { type: "activity"; activity: Activity } | { type: "done" };

export interface PlainInteraction {
  interact: (ui: UiController, world: GameWorld) => InteractionResult | undefined;
}

export class ReceiveBookInteraction implements PlainInteraction {
  private next?: Activity;

  constructor(private character: Character) { }

  interact(ui: UiController, world: GameWorld): InteractionResult | undefined {
    const item = ui.getSelectedItem();
    if (!(item instanceof Book)) {
      return undefined;
    }

    if (item.getEntries().some((char) => char === this.character)) {
      showPlainTextDialog({
        ui,
        character: this.character,
        text: "Milleks mulle see. Ma olen majaraamatus kenasti kirjas.\nToo endale šoppen vett, et oma tähelepanu turgutada.",
      });
      return { type: "activity", activity: new CallFuxActivity(this.character, new RequestWaterInteraction(this.character)) };
    } else {
      showPlainTextDialog({
        ui,
        character: this.character,
        text: "Paistab, et olen unustanud end majaraamatusse kirjutada. Tänud tähelepanu juhtimast. Siin sulle kuue õlle raha.",
      });
      item.addEntry(this.character);
      ui.getAttributes().wallet.add(getDrink("alexander").price * 6);
      return { type: "done" };
    }
  }
}
