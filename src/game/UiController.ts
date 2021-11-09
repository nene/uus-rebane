import { PixelScreen } from "./PixelScreen";
import { GameItem } from "./items/GameItem";
import { InventoryController } from "./InventoryController";
import { Overlay } from "./ui/Overlay";
import { CursorController } from "./CursorController";
import { MiniGame } from "./minigames/MiniGame";
import { ScoreBoard } from "./ScoreBoard";
import { GameEvent } from "./GameEvent";
import { InventoryView } from "./inventory/InventoryView";
import { PlayerAttributes } from "./attributes/PlayerAttributes";
import { Coord } from "./Coord";
import { Calendar } from "./Calendar";
import { Component } from "./ui/Component";
import { QuestionFactory } from "./questions/QuestionFactory";
import { GameWorld } from "./GameWorld";
import { Character } from "./npc/Character";
import { createWorld } from "./locations/createWorld";
import { DayTransition } from "./DayTransition";

export class UiController {
  private world: GameWorld;
  private inventoryController: InventoryController;
  private cursorController: CursorController;
  private modalWindow?: Component;
  private infoModalWindow?: Component;
  private scoreBoard: ScoreBoard;
  private calendar: Calendar;
  private questionFacory: QuestionFactory;
  private touchingColorBand = false;
  private attributes = new PlayerAttributes();
  private dayTransition?: DayTransition;

  constructor() {
    this.world = createWorld(1);
    this.calendar = new Calendar({
      onDayEnd: (day) => {
        this.dayTransition = new DayTransition({
          calendar: this.calendar,
          onHalfWay: () => {
            this.inventoryController.resetForNewDay();
            this.modalWindow = undefined;
            this.attributes.drunkenness.reset();
            this.world = createWorld(day + 1);
            this.calendar.setDay(day + 1);
          },
          onFinished: () => {
            this.dayTransition = undefined;
          }
        });
      },
    });

    this.inventoryController = new InventoryController(this.attributes);
    this.cursorController = new CursorController();
    this.scoreBoard = new ScoreBoard([269, 0], this.attributes.wallet, this.attributes.drunkenness, this.calendar);
    this.questionFacory = new QuestionFactory(this.attributes.orgSkill);
  }

  getSelectedItem(): GameItem | undefined {
    return this.inventoryController.getSelectedItem();
  }

  setSelectedItem(item: GameItem | undefined) {
    this.inventoryController.setSelectedItem(item);
  }

  showInventory(view: InventoryView) {
    this.inventoryController.showInventory(view);
  }

  hideInventory() {
    this.inventoryController.hideInventory();
  }

  getAttributes(): PlayerAttributes {
    return this.attributes;
  }

  tick() {
    if (this.isGameWorldActive()) {
      this.world.tick();
      this.inventoryController.tick();
      this.calendar.tick();
    } else {
      this.dayTransition?.tick();
    }
  }

  paint(screen: PixelScreen) {
    if (this.isGameWorldVisible()) {
      this.world.paint(screen);
    }

    screen.withFixedCoords(() => {
      if (this.getMiniGame()) {
        this.getMiniGame()?.paint(screen);
        if (this.infoModalWindow) {
          Overlay.paint(screen);
          this.infoModalWindow.paint(screen);
          this.cursorController.paint(screen);
        }
      } else if (this.infoModalWindow) {
        Overlay.paint(screen);
        this.infoModalWindow.paint(screen);
      } else if (this.modalWindow) {
        Overlay.paint(screen);
        this.modalWindow.paint(screen);
      } else {
        this.inventoryController.paint(screen);
      }

      this.scoreBoard.paint(screen);

      this.dayTransition?.paint(screen);

      if (!this.getMiniGame()) {
        this.cursorController.paint(screen);
      }
    });
  }

  isGameWorldActive(): boolean {
    // Time always stops when game is excplicitly paused or during day transitions
    if (this.infoModalWindow || this.dayTransition) {
      return false;
    }
    // Time also stops when inventory or modalWindow is open,
    // but regardless of that, time always runs during mini-game.
    return Boolean(this.getMiniGame()) || (!this.inventoryController.isObjectInventoryShown() && !this.modalWindow);
  }

  isGameWorldVisible(): boolean {
    return !this.inventoryController.getMiniGame();
  }

  handleGameEvent(event: GameEvent): boolean | undefined {
    let stopPropagation: boolean | undefined = undefined;
    stopPropagation = stopPropagation || this.getMiniGame()?.handleGameEvent(event);
    stopPropagation = stopPropagation || this.cursorController.handleGameEvent(event);
    stopPropagation = stopPropagation || this.infoModalWindow?.handleGameEvent(event);
    stopPropagation = stopPropagation || this.modalWindow?.handleGameEvent(event);
    stopPropagation = stopPropagation || this.inventoryController.handleGameEvent(event);
    stopPropagation = stopPropagation || this.dayTransition?.handleGameEvent(event);
    if (stopPropagation) {
      return true;
    }
  }

  highlightCursor(highlighted: boolean) {
    this.cursorController.setHighlighted(highlighted);
  }

  getMouseCoord(): Coord {
    return this.cursorController.getCoord();
  }

  private getMiniGame(): MiniGame | undefined {
    return this.inventoryController.getMiniGame();
  }

  // Normal modal
  showModal(modalWindow: Component) {
    this.modalWindow = modalWindow;
  }

  hideModal() {
    this.modalWindow = undefined;
  }

  // Info-modal
  getInfoModal(): Component | undefined {
    return this.infoModalWindow;
  }

  showInfoModal(infoModalWindow: Component) {
    this.infoModalWindow = infoModalWindow;
  }

  hideInfoModal() {
    this.infoModalWindow = undefined;
  }

  questions(): QuestionFactory {
    return this.questionFacory;
  }

  getWorld() {
    return this.world;
  }

  touchColorBand(character: Character) {
    this.touchingColorBand = true;
    this.world.getActiveLocation().findCharacterFigure(character)?.onInteract(this);
    this.touchingColorBand = false;
  }

  isTouchingColorBand() {
    return this.touchingColorBand;
  }
}
