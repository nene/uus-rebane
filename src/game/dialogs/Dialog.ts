import { Alignment, coordAdd, isCoordInRect, Rect, rectGrow } from "../Coord";
import { GameEvent } from "../GameEvent";
import { ColorBandTouch } from "../items/ColorBandTouch";
import { AcademicCharacter, isAcademicCharacter } from "../npc/AcademicCharacter";
import { Character } from "../npc/Character";
import { PixelScreen } from "../PixelScreen";
import { SpriteLibrary } from "../sprites/SpriteLibrary";
import { Component } from "../ui/Component";
import { UI_HIGHLIGHT_COLOR } from "../ui/ui-utils";
import { Window } from "../ui/Window";
import { UiController } from "../UiController";

interface DialogConfig {
  ui: UiController;
  character: Character;
  createContent: (rect: Rect) => Component,
  onClose?: () => void;
  align?: Alignment;
}

export class Dialog implements Component {
  private ui: UiController;
  private window: Window;
  private content: Component;
  private onClose?: () => void;
  private character: Character;
  private iconRect: Rect;
  private iconHovered = false;

  constructor({ ui, character, createContent, onClose, align }: DialogConfig) {
    this.ui = ui;
    this.onClose = onClose;
    this.character = character;
    this.window = new Window({
      headline: {
        title: character.getName() + ":",
        description: " ",
      },
      headlinePadding: 20,
      size: [200, 109],
      align: align ?? "bottom",
      onClose: onClose
    });
    this.content = createContent(rectGrow(this.window.contentAreaRect(), [-2, -2]));
    this.iconRect = { coord: coordAdd(this.window.getRect().coord, [2, 2]), size: [16, 16] };
  }

  paint(screen: PixelScreen) {
    this.window.paint(screen);
    this.drawIcon(screen);
    this.content.paint(screen);
  }

  private drawIcon(screen: PixelScreen) {
    if (this.iconHovered && isAcademicCharacter(this.character)) {
      this.drawColorBand(screen, this.character);
    } else {
      this.drawAvatar(screen);
    }
  }

  private drawColorBand(screen: PixelScreen, character: AcademicCharacter) {
    screen.drawSprite(SpriteLibrary.getSprite("color-band", [character.getColorBandState(), 0]), this.iconRect.coord);
  }

  private drawAvatar(screen: PixelScreen) {
    screen.drawRect(this.iconRect, UI_HIGHLIGHT_COLOR);
    screen.drawSprite(this.character.getFaceSprite(), this.iconRect.coord);
  }

  getRect(): Rect {
    return this.window.getRect();
  }

  handleGameEvent(event: GameEvent): boolean | undefined {
    if (this.window.handleGameEvent(event) || this.content.handleGameEvent(event)) {
      return true;
    }

    if (event.type === "mousemove" && isAcademicCharacter(this.character) && !this.ui.getAttributes().getSelectedItem()) {
      this.iconHovered = isCoordInRect(event.coord, this.iconRect);
      this.ui.highlightCursor(this.iconHovered);
      return true;
    }

    if (event.type === "click") {
      if (isCoordInRect(event.coord, this.iconRect)) {
        this.touchColorBand();
      }
      if (!isCoordInRect(event.coord, this.getRect())) {
        this.onClose && this.onClose();
      }
      return true;
    }

    return undefined;
  }

  private touchColorBand() {
    this.ui.getWorld().getActiveLocation().findCharacterFigure(this.character)?.interact(this.ui, new ColorBandTouch());
  }
}
