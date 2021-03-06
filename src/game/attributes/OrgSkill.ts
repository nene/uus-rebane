import { Subject } from "rxjs";
import { allOrganizations, Organization, OrgSkillLevel } from "../orgs/Organization";
import { QuestionCategory } from "../questions/Question";
import { SpriteLibrary } from "../sprites/SpriteLibrary";
import { LevelUpSubject, Skill } from "./Skill";

const correctAnswersPerLevel: Record<OrgSkillLevel, number> = {
  [OrgSkillLevel.estica]: 4, // All four possible questions
  [OrgSkillLevel.fraternities1]: 10, // Max 5x4 questions
  [OrgSkillLevel.sororities]: 10, // Max 6x4 questions
  [OrgSkillLevel.fraternities2]: 10, // Max 5x4 questions
  [OrgSkillLevel.unions]: 10, // Max 6x4 questions
  [OrgSkillLevel.friends]: 10, // Max 5x4 questions
  [OrgSkillLevel.latvia]: 100,
  [OrgSkillLevel.level7]: 100,
  [OrgSkillLevel.level8]: 100,
  [OrgSkillLevel.level9]: 100,
  [OrgSkillLevel.level10]: 100,
};

// Skill of answering questions about Academic Organizations.
// As the player levels up, questions become harder.
export class OrgSkill implements Skill {
  private level = OrgSkillLevel.estica;
  private correctAnswers = 0;
  public levelUp$: LevelUpSubject = new Subject();

  getName() {
    return "Ak. Orgid";
  }

  getLevel(): OrgSkillLevel {
    return this.level;
  }

  getProgress(): number {
    return this.correctAnswers / correctAnswersPerLevel[this.level];
  }

  // Notifies about correctly answered question
  rightAnswer() {
    this.correctAnswers++;
    if (this.correctAnswers >= correctAnswersPerLevel[this.level]) {
      this.levelUp();
    }
  }

  // Notifies about incorrectly answered question
  wrongAnswer() {
    // For now, do nothing
  }

  private levelUp() {
    if (this.level < OrgSkillLevel.level10) {
      this.level++;
      this.correctAnswers = 0;
      this.levelUp$.next({ skill: this, msg: "Oled ak orgide osas targemaks saanud!" });
    }
  }

  getIcon() {
    return SpriteLibrary.getSprite("level-up-icons", [1, 0]);
  }

  // About which orgs we ask questions
  getTargetOrgs(): Organization[] {
    return allOrganizations().filter((org) => org.level === this.level);
  }

  // Which additional orgs are allowed in the multi-choice answers
  getPossibleOrgs(): Organization[] {
    return allOrganizations();
  }

  getEnabledCategories(): QuestionCategory[] {
    return ["colors", "place", "slogan", "year"];
  }
}
