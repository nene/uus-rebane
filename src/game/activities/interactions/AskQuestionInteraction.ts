import { AcademicCharacter } from "../../npc/AcademicCharacter";
import { UiApi } from "../../UiController";
import { TextContent } from "../../dialogs/TextContent";
import { FlagQuestionContent } from "../../dialogs/FlagQuestionContent";
import { Interaction } from "./Interaction";
import { Dialog } from "../../dialogs/Dialog";
import { ColorsQuestion, MultiChoiceQuestion, Question } from "../../questions/Question";
import { ValidationResult } from "../../questions/ValidationResult";
import { Rect } from "../../Coord";
import { MultiChoiceQuestionContent } from "../../dialogs/MultiChoiceQuestionContent";
import { CallFuxActivity } from "../CallFuxActivity";
import { RequestWaterInteraction } from "./RequestWaterInteraction";
import { SoundLibrary } from "../../sounds/SoundLibrary";
import { CalloutSpriteFactory, InteractionType } from "./CalloutSpriteFactory";

export class AskQuestionInteraction implements Interaction {
  private finished = false;
  private punishWithWater = false;

  constructor(private character: AcademicCharacter) {
  }

  getCalloutSprites() {
    return [CalloutSpriteFactory.getSprite(InteractionType.question)];
  }

  tryComplete() {
    return false;
  }

  isFinished() {
    return this.finished;
  }

  interact(ui: UiApi) {
    const question = ui.questions().create();

    ui.showModal(new Dialog({
      ui,
      character: this.character,
      createContent: (rect) => {
        if (question.type === "colors") {
          return this.createColorsContent(ui, rect, question);
        } else {
          return this.createMultiChoiceContent(ui, rect, question);
        }
      },
    }));
  }

  private createColorsContent(ui: UiApi, rect: Rect, question: ColorsQuestion) {
    return new FlagQuestionContent({
      question: question.question,
      container: rect,
      onAnswer: (colors) => {
        this.handleValidationResult(question.validate(colors), question, ui);
      },
    });
  }

  private createMultiChoiceContent(ui: UiApi, rect: Rect, question: MultiChoiceQuestion) {
    return new MultiChoiceQuestionContent({
      container: rect,
      question: question.question,
      choices: question.choices,
      fontSize: question.fontSize,
      onAnswer: (answer) => {
        this.handleValidationResult(question.validate(answer), question, ui);
      }
    });
  }

  private handleValidationResult(result: ValidationResult, question: Question, ui: UiApi) {
    this.showReply(ui, result.msg);
    this.character.satisfyDesire("question");
    if (result.type === "punish") {
      SoundLibrary.play("hmm-disproval");
      ui.questions().wrongAnswer(question);
      this.character.changeOpinion(-1);
      this.punishWithWater = true;
    }
    else if (result.type === "praise") {
      SoundLibrary.play("hmm-approval");
      ui.questions().rightAnswer(question);
      this.character.changeOpinion(+1);
    }
    this.finished = true;
  }

  nextActivity() {
    if (this.punishWithWater) {
      return new CallFuxActivity(this.character, new RequestWaterInteraction(this.character));
    }
  }

  private showReply(ui: UiApi, text: string) {
    ui.showModal(new Dialog({
      ui,
      character: this.character,
      createContent: (rect) => new TextContent({ text, rect, animated: true }),
      onClose: () => ui.hideModal(),
    }));
  }
}
