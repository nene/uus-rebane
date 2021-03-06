import { PixelScreen } from "./PixelScreen";
import { SpriteLibrary } from "./sprites/SpriteLibrary";
import { SoundLibrary } from "./sounds/SoundLibrary";
import { Coord, coordAdd } from "./Coord";
import { UiController } from "./UiController";
import { Loops } from "./Loops";
import { FpsCounter } from "./FpsCounter";
import { GameEventFactory, GameEventType } from "./GameEvent";
import { toggleOpinionsView, toggleSkillsView } from "./ui/infoModals";

export interface GameApi {
  onKeyEvent: (type: "keyup" | "keydown", key: string) => boolean;
  onMouseEvent: (type: GameEventType, coord: Coord, wheelDelta?: Coord) => void;
  cleanup: () => void;
}

export async function runGame(ctx: CanvasRenderingContext2D, offscreenCtx: CanvasRenderingContext2D): Promise<GameApi> {
  const screen = new PixelScreen(ctx, new PixelScreen(offscreenCtx));
  let screenNeedsRepaint = true;

  await SpriteLibrary.load();
  await SoundLibrary.load();

  const ui = new UiController();

  const loops = new Loops();
  loops.runGameLoop(() => {
    ui.tick();
    screenNeedsRepaint = true;
  });

  const fps = new FpsCounter();
  loops.runPaintLoop(() => {
    fps.countFrame();
    if (!screenNeedsRepaint) {
      return; // Don't paint when app state hasn't changed
    }
    ui.paint(screen);
    fps.paint(screen);
    screenNeedsRepaint = false;
  });

  function toWorldCoord(screenCoord: Coord): Coord {
    return coordAdd(screenCoord, screen.getOffset());
  }

  const eventFactory = new GameEventFactory();

  return {
    onKeyEvent: (type: "keyup" | "keydown", key: string): boolean => {
      const event = eventFactory.createKeyboardEvent(type, key);
      if (event.type === "keydown" && event.key === "OPINIONS") {
        toggleOpinionsView(ui);
      }
      if (event.type === "keydown" && event.key === "SKILLS") {
        toggleSkillsView(ui);
      }
      if (ui.isGameWorldActive() && ui.isGameWorldVisible()) {
        const result = ui.getWorld().getPlayer().handleKeyEvent(event);
        ui.highlightCursor(ui.getWorld().isInteractable(ui, toWorldCoord(ui.getMouseCoord())));
        screenNeedsRepaint = true;
        return result;
      }
      return false;
    },
    onMouseEvent: (type: GameEventType, coord: Coord, wheelDelta?: Coord) => {
      screenNeedsRepaint = true;
      const event = eventFactory.createEvent(type, coord, wheelDelta);
      if (type === "click") {
        if (!ui.handleGameEvent(event)) {
          // When the click was not handled by UI
          ui.getWorld().interact(ui, toWorldCoord(event.coord));
        }
      }
      else if (type === "mousemove") {
        if (ui.handleGameEvent(event)) {
          return;
        }
        if (ui.isGameWorldActive() && ui.isGameWorldVisible()) {
          ui.highlightCursor(ui.getWorld().isInteractable(ui, toWorldCoord(event.coord)));
        } else {
          ui.highlightCursor(false);
        }
      } else {
        ui.handleGameEvent(event);
      }
    },
    cleanup: () => {
      loops.cleanup();
    },
  };
}
