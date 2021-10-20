import { Activity } from "../activities/Activity";
import { CallFuxActivity } from "../activities/CallFuxActivity";
import { IdleActivity } from "../activities/IdleActivity";
import { MoveToTableActivity } from "../activities/MoveToTableActivity";
import { MoveToDoorActivity } from "../activities/MoveToDoorActivity";
import { DespawnActivity } from "../activities/DespawnActivity";
import { Character } from "./Character";
import { PauseActivity } from "../activities/PauseActivity";
import { AskQuestionInteraction } from "../activities/AskQuestionInteraction";
import { RequestDrinkInteraction } from "../activities/RequestDrinkInteraction";
import { createColorsQuestion } from "../questions/ColorsQuestion";
import { createYearQuestion } from "../questions/YearQuestion";
import { createSloganQuestion } from "../questions/SloganQuestion";
import { createPlaceQuestion } from "../questions/PlaceQuestion";

export class Desires {
  private queue: Activity[] = [];
  private idle: Activity;

  constructor(character: Character) {
    this.idle = new IdleActivity(character);
    this.queue = [
      new PauseActivity(5, character),
      new MoveToTableActivity(character),
      new CallFuxActivity(character, new AskQuestionInteraction(character, createPlaceQuestion())),
      new CallFuxActivity(character, new AskQuestionInteraction(character, createSloganQuestion())),
      new CallFuxActivity(character, new AskQuestionInteraction(character, createColorsQuestion())),
      new CallFuxActivity(character, new AskQuestionInteraction(character, createYearQuestion())),
      new CallFuxActivity(character, new RequestDrinkInteraction(character)),
      new MoveToDoorActivity(character),
      new DespawnActivity(character),
    ];
  }

  private startActivity(activity: Activity) {
    this.queue.unshift(activity);
  }

  private finishCurrentActivity() {
    this.queue.shift();
  }

  currentActivity(): Activity {
    if (this.queue.length === 0) {
      return this.idle;
    }

    if (this.queue[0].isFinished()) {
      const nextActivity = this.queue[0].nextActivity();
      this.finishCurrentActivity();
      if (nextActivity) {
        this.startActivity(nextActivity);
      }
      return this.currentActivity();
    }
    return this.queue[0];
  }
}
