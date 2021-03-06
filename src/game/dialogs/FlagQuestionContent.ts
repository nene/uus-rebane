import { reverse } from "lodash";
import { Coord, coordAdd, coordMul, Rect, rectCenter } from "../Coord";
import { GameEvent } from "../GameEvent";
import { TextButton } from "../ui/TextButton";
import { PixelScreen } from "../PixelScreen";
import { ColorButton } from "../ui/ColorButton";
import { ColorMenu } from "../ui/ColorMenu";
import { TextContent } from "./TextContent";
import { FlagColor } from "../orgs/FlagColors";
import { TickableComponent } from "../ui/Component";
import { isDefined } from "../utils/isDefined";
import { CounterAnimation } from "./CounterAnimation";

interface FlagQuestionContentConfig {
  question: string;
  container: Rect;
  onAnswer: (colors: FlagColor[]) => void;
}

export class FlagQuestionContent implements TickableComponent {
  private question: TextContent;
  private colorButtons: ColorButton[];
  private menu?: ColorMenu;
  private answerButton: TextButton;
  private answerButtonsVisible = new CounterAnimation({ ticksPerFrame: 2, total: 2 });

  constructor({ question, container, onAnswer }: FlagQuestionContentConfig) {
    this.question = new TextContent({ text: question, rect: container, animated: true });
    this.colorButtons = this.createColorButtons(container);
    this.answerButton = new TextButton({
      rect: { coord: coordAdd(container.coord, [container.size[0] - 60, container.size[1] - 14]), size: [60, 14] },
      text: "Vasta",
      onClick: () => onAnswer(this.getAnswer()),
    });
  }

  private createColorButtons(container: Rect): ColorButton[] {
    const buttonSize: Coord = [14, 14];
    const threeButtonsSize = coordAdd(coordMul(buttonSize, [3, 1]), [2, 0]);
    const buttonsRect = rectCenter({ coord: [0, 0], size: threeButtonsSize }, container);

    return [0, 1, 2].map((i) => {
      const buttonOffset = 15 * i;
      const coord = coordAdd(buttonsRect.coord, [buttonOffset, 0])
      const btn = new ColorButton({
        coord: coord,
        onClick: () => { this.showMenu(btn, coord); },
      });
      return btn;
    });
  }

  private getAnswer(): FlagColor[] {
    return this.colorButtons.map((button) => button.getColor()).filter(isDefined);
  }

  tick() {
    this.question.tick();
    if (this.question.isAnimationFinished()) {
      this.answerButtonsVisible.tick();
    }
  }

  paint(screen: PixelScreen) {
    this.question.paint(screen);

    if (this.answerButtonsVisible.getCount() >= 1) {
      // HACK: Render from right to left, so tooltips render on top of buttons
      screen.paint(reverse([...this.colorButtons]));
    }

    if (this.answerButtonsVisible.getCount() >= 2) {
      this.answerButton.paint(screen);
    }

    this.menu?.paint(screen);
  }

  handleGameEvent(event: GameEvent): boolean | undefined {
    if (this.menu?.handleGameEvent(event)) {
      return true;
    }
    this.colorButtons.forEach((btn) => {
      btn.handleGameEvent(event);
    });
    this.answerButton.handleGameEvent(event);
  }

  private showMenu(btn: ColorButton, coord: Coord) {
    this.menu = new ColorMenu({
      container: { coord, size: [16, 16] },
      onSelect: (color) => {
        btn.setColor(color);
        this.menu = undefined;
      }
    });
  }
}
