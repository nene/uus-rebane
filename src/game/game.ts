import { PixelScreen } from "./PixelScreen";
import { Player } from "./Player";
import { Background } from "./Background";
import { GameWorld } from "./GameWorld";
import { SpriteLibrary } from "./SpriteLibrary";
import { SoundLibrary } from "./SoundLibrary";
import { CfeLocation } from "./CfeLocation";

export async function runGame(ctx: CanvasRenderingContext2D, seed: string) {
  const screen = new PixelScreen(ctx, { width: 256, height: 256, scale: 4, offset: [16, 16] });

  const sprites = new SpriteLibrary();
  await sprites.load();
  const sounds = new SoundLibrary();
  await sounds.load();

  const location = new CfeLocation(sprites);
  const background = new Background(location.getBackground());

  const world = new GameWorld(location);

  const player = new Player(sprites, [32, 64]);
  world.add(player);

  gameLoop(() => {
    world.allObjects().forEach((obj) => obj.tick(world));
    world.sortObjects();
  });

  paintLoop(() => {
    screen.centerTo(player.getCoord(), world);
    background.paint(screen);
    world.allObjects().forEach((obj) => obj.paint(screen));
  });

  return {
    onKeyDown: (key: string) => {
      player.handleKeyDown(key, world);
    },
    onKeyUp: (key: string) => {
      player.handleKeyUp(key, world);
    },
  };
}

// setInterval() will fire about 1x per second when in background tab
function gameLoop(onTick: () => void) {
  const duration = 100;
  let prevTime = Date.now();
  setInterval(() => {
    const time = Date.now();
    while (prevTime + duration < time) {
      onTick();
      prevTime += duration;
    }
  }, duration / 2);
}

function paintLoop(onPaint: (time: number) => void) {
  function paint(time: number) {
    onPaint(time);
    window.requestAnimationFrame(paint);
  }
  window.requestAnimationFrame(paint);
}
