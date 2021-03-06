import { OrgSkill } from "../attributes/OrgSkill";
import { TermSkill } from "../attributes/TermSkill";
import { pickRandom } from "../utils/pickRandom";
import { createColorsQuestion } from "./ColorsQuestion";
import { createPlaceQuestion } from "./PlaceQuestion";
import { Question, QuestionCategory } from "./Question";
import { createSloganQuestion } from "./SloganQuestion";
import { createTerminologyQuestion } from "./TerminologyQuestion";
import { createYearQuestion } from "./YearQuestion";

const QUESTIONS_BETWEEN_DUPLICATE_QUESTIONS = 2;
// To avoid getting stuck in the loop of getting a question that hasn't been answered and wasn't asked previously.
// Shouldn't normally happen, but in case it does, the result would be bad: infinite loop.
const MAX_RETRIES = 200;

export class QuestionFactory {
  private previousQuestions: string[] = [];
  private answeredQuestions: string[] = [];

  constructor(private orgSkill: OrgSkill, private termSkill: TermSkill) { }

  create(): Question {
    let retries = 0;

    while (true) {
      const question = this.generateQuestion();
      if (this.isSuitableQuestion(question.question) || retries > MAX_RETRIES) {
        this.rememberQuestion(question.question);
        return question;
      }
      retries++;
    }
  }

  private generateQuestion(): Question {
    const categories: QuestionCategory[] = [...this.orgSkill.getEnabledCategories(), "terminology"];

    switch (pickRandom(categories)) {
      case "colors": return createColorsQuestion(this.orgSkill.getTargetOrgs());
      case "place": return createPlaceQuestion(this.orgSkill.getTargetOrgs(), this.orgSkill.getPossibleOrgs());
      case "slogan": return createSloganQuestion(this.orgSkill.getTargetOrgs(), this.orgSkill.getPossibleOrgs());
      case "year": return createYearQuestion(this.orgSkill.getTargetOrgs(), this.orgSkill.getPossibleOrgs());
      case "terminology": return createTerminologyQuestion(this.termSkill.getLevel());
    }
  }

  private isSuitableQuestion(question: string): boolean {
    return !this.previousQuestions.includes(question) && !this.answeredQuestions.includes(question);
  }

  private rememberQuestion(question: string) {
    this.previousQuestions.push(question);
    if (this.previousQuestions.length > QUESTIONS_BETWEEN_DUPLICATE_QUESTIONS) {
      this.previousQuestions.shift();
    }
  }

  rightAnswer(question: Question) {
    this.answeredQuestions.push(question.question);
    if (this.isOrgQuestion(question)) {
      this.orgSkill.rightAnswer();
    }
    if (this.isTermQuestion(question)) {
      this.termSkill.rightAnswer();
    }
  }

  wrongAnswer(question: Question) {
    if (this.isOrgQuestion(question)) {
      this.orgSkill.wrongAnswer();
    }
    if (this.isTermQuestion(question)) {
      this.termSkill.wrongAnswer();
    }
  }

  private isOrgQuestion(question: Question): boolean {
    return this.orgSkill.getEnabledCategories().includes(question.category);
  }

  private isTermQuestion(question: Question): boolean {
    return question.category === "terminology";
  }
}
