import { randomOrganization } from "../orgs/Organization";
import { generateChoices } from "./generateChoices";
import { MultiChoiceQuestion } from "./Question";

export function createPlaceQuestion(): MultiChoiceQuestion {
  const org = randomOrganization();
  return {
    type: "multi-choice",
    question: `Kus on asutatud ${org.name}?`,
    choices: generateChoices(org, (org) => org.establishedPlace),
    validate: (establishedPlace: string) => {
      if (establishedPlace === org.establishedPlace) {
        return "Õige vastus! Oled tubli.";
      } else {
        return `Vale puha! ${org.name} asutamiskoht on ${org.establishedPlace}.\nVõta laituseks sisse.`;
      }
    },
  };
}