import { UiController } from "../../UiController";
import { Activity } from "../Activity";

export type InteractionResult = { type: "activity"; activity: Activity } | { type: "done" };

export interface PlainInteraction {
  interact: (ui: UiController) => InteractionResult | undefined;
}