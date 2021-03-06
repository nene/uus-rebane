import bg from "./data/bg.png";
import cfeReb from "./data/cfe-reb.png";
import cfeKsvSass from "./data/cfe-ksv-sass.png";
import cfeKsvKoppel from "./data/cfe-ksv-koppel.png";
import cfeKsvPikmets from "./data/cfe-ksv-pikmets.png";
import cfeKsvOtto from "./data/cfe-ksv-otto.png";
import cfeKsvKarl from "./data/cfe-ksv-karl.png";
import cfeKsvKark from "./data/cfe-ksv-kark.png";
import feenoksLady from "./data/feenoks-lady.png";
import buildings from "./data/buildings.png";
import grass from "./data/grass.png";
import fence from "./data/fence.png";
import callout from "./data/callout.png";
import table from "./data/table.png";
import fridge from "./data/fridge.png";
import beerCabinet from "./data/beer-cabinet.png";
import beerBox from "./data/beer-box.png";
import bookCabinet from "./data/book-cabinet.png";
import kitchenSink from "./data/kitchen-sink.png";
import lightSwitch from "./data/light-switch.png";
import items from "./data/items.png";
import door from "./data/door.png";
import doorLarge from "./data/door-large.png";
import staircaseDoor from "./data/staircase-door.png";
import colorShield from "./data/color-shield.png";
import colorBand from "./data/color-band.png";
import bulletinBoard from "./data/bulletin-board.png";
import poloniaCartel from "./data/polonia-cartel.png";
import cfeCoatOfArms from "./data/cfe-coat-of-arms.png";
import sakalaCoatOfArms from "./data/sakala-coat-of-arms.png";
import fireplace from "./data/fireplace.png";
import countertop from "./data/countertop.png";
import lamp from "./data/lamp.png";
import sakalaLamp from "./data/sakala-lamp.png";
import sakalaCandleLamp from "./data/sakala-candle-lamp.png";
import slot from "./data/slot.png";
import scrollBar from "./data/scroll-bar.png";
import closeButton from "./data/close-button.png";
import cursor from "./data/cursor.png";
import scoreboard from "./data/scoreboard.png";
import gold from "./data/gold.png";
import flagColors from "./data/flag-colors.png";
import beerGlassLg from "./data/beer-glass-lg.png";
import beerGlassSm from "./data/beer-glass-sm.png";
import bottle from "./data/bottle.png";
import openingGameBg from "./data/opening-game-bg.png";
import bottleXl from "./data/bottle-xl.png";
import bottleCapXl from "./data/bottle-cap-xl.png";
import bottleOpenerXl from "./data/bottle-opener-xl.png";
import cfeBgLg from "./data/cfe-bg-lg.png";
import beerGlassXl from "./data/beer-glass-xl.png";
import beerXl from "./data/beer-xl.png";
import beerFoamXl from "./data/beer-foam-xl.png";
import opinionShield from "./data/opinion-shield.png";
import feenoksShelf from "./data/feenoks-shelf.png";
import feenoksFridge from "./data/feenoks-fridge.png";
import feenoksCounter from "./data/feenoks-counter.png";
import feenoksPaymentCounter from "./data/feenoks-payment-counter.png";
import feenoksCounterSideways from "./data/feenoks-counter-sideways.png";
import amicitiaFlag from "./data/amicitia-flag.png";
import furniture from "./data/furniture.png";
import leaves from "./data/leaves.png";
import leaves2 from "./data/leaves2.png";
import leaves3 from "./data/leaves3.png";
import levelUp from "./data/level-up.png";
import levelUpIcons from "./data/level-up-icons.png";
import levelUpMini from "./data/level-up-mini.png";
import ribbonFrame from "./data/ribbon-frame.png";

import { Coord } from "../Coord";
import { SpriteSheet, SpriteSheetConfig } from "./SpriteSheet";

const CHARACTER_SIZE: Coord = [16, 36];
const CHARACTER_OFFSET: Coord = [-8, -33];
export const CALLOUT_OFFSET: Coord = [-5, -56];

// Helper to require values of `imageFiles` to conform to specific type
const spriteDef = (x: { src: string, cfg: SpriteSheetConfig }) => x;

const imageFiles = {
  'bg': spriteDef({ src: bg, cfg: { size: [16, 16], colsRows: [13, 6] } }),
  'grass': spriteDef({ src: grass, cfg: { size: [16, 16], colsRows: [5, 3] } }),
  'buildings': spriteDef({ src: buildings, cfg: { size: [16, 16], colsRows: [16, 26] } }),
  'leaves': spriteDef({ src: leaves, cfg: { size: [27, 17], colsRows: [16, 3] } }),
  'leaves2': spriteDef({ src: leaves2, cfg: { size: [13, 24], colsRows: [4, 3] } }),
  'leaves3': spriteDef({ src: leaves3, cfg: { size: [7, 30], colsRows: [6, 3] } }),

  'cfe-reb': spriteDef({ src: cfeReb, cfg: { size: [32, 38], colsRows: [9, 8], offset: [-16, -33] } }),

  'cfe-ksv-sass': spriteDef({ src: cfeKsvSass, cfg: { size: CHARACTER_SIZE, colsRows: [3, 1], offset: CHARACTER_OFFSET } }),
  'cfe-ksv-koppel': spriteDef({ src: cfeKsvKoppel, cfg: { size: CHARACTER_SIZE, colsRows: [3, 1], offset: CHARACTER_OFFSET } }),
  'cfe-ksv-pikmets': spriteDef({ src: cfeKsvPikmets, cfg: { size: CHARACTER_SIZE, colsRows: [3, 1], offset: CHARACTER_OFFSET } }),
  'cfe-ksv-otto': spriteDef({ src: cfeKsvOtto, cfg: { size: CHARACTER_SIZE, colsRows: [3, 1], offset: CHARACTER_OFFSET } }),
  'cfe-ksv-karl': spriteDef({ src: cfeKsvKarl, cfg: { size: CHARACTER_SIZE, colsRows: [3, 1], offset: CHARACTER_OFFSET } }),
  'cfe-ksv-kark': spriteDef({ src: cfeKsvKark, cfg: { size: CHARACTER_SIZE, colsRows: [3, 1], offset: CHARACTER_OFFSET } }),
  'callout': spriteDef({ src: callout, cfg: { size: [16, 22], colsRows: [8, 1], offset: CALLOUT_OFFSET } }),

  // Furniture
  'furniture': spriteDef({ src: furniture, cfg: { size: [130, 78] } }),
  'table': spriteDef({ src: table, cfg: { size: [64, 32], colsRows: [5, 1], offset: [0, -6] } }),
  'fridge': spriteDef({ src: fridge, cfg: { size: [16, 46], offset: [0, -32] } }),
  'beer-cabinet': spriteDef({ src: beerCabinet, cfg: { size: [32, 46], offset: [0, -32] } }),
  'beer-box': spriteDef({ src: beerBox, cfg: { size: [11, 14], offset: [3, -4] } }),
  'book-cabinet': spriteDef({ src: bookCabinet, cfg: { size: [20, 57], colsRows: [2, 1], offset: [-2, -48] } }),
  'kitchen-sink': spriteDef({ src: kitchenSink, cfg: { size: [16, 43], offset: [0, -11] } }),
  'door': spriteDef({ src: door, cfg: { size: [20, 35], offset: [-2, -34] } }),
  'door-large': spriteDef({ src: doorLarge, cfg: { size: [33, 38], offset: [-1, -38] } }),
  'staircase-door': spriteDef({ src: staircaseDoor, cfg: { size: [32, 48], colsRows: [2, 1], offset: [0, -48] } }),
  'fireplace': spriteDef({ src: fireplace, cfg: { size: [64, 52], colsRows: [5, 1], offset: [0, -36] } }),
  'countertop': spriteDef({ src: countertop, cfg: { size: [16, 55], offset: [0, -23] } }),
  'lamp': spriteDef({ src: lamp, cfg: { size: [21, 24], colsRows: [2, 1], offset: [-3, -44] } }),
  'light-switch': spriteDef({ src: lightSwitch, cfg: { size: [9, 6], colsRows: [2, 1], offset: [4, -19] } }),
  // paintings
  'bulletin-board': spriteDef({ src: bulletinBoard, cfg: { size: [13, 17], offset: [4, 8] } }),
  'color-shield': spriteDef({ src: colorShield, cfg: { size: [11, 12], offset: [3, 8] } }),
  'polonia-cartel': spriteDef({ src: poloniaCartel, cfg: { size: [24, 29], offset: [1, 2] } }),
  'cfe-coat-of-arms': spriteDef({ src: cfeCoatOfArms, cfg: { size: [53, 48], offset: [6, 0] } }),
  'sakala-coat-of-arms': spriteDef({ src: sakalaCoatOfArms, cfg: { size: [59, 36], offset: [12, 5] } }),

  // UI
  'slot': spriteDef({ src: slot, cfg: { size: [16, 16], colsRows: [2, 1] } }),
  'scroll-bar': spriteDef({ src: scrollBar, cfg: { size: [8, 8], colsRows: [5, 1] } }),
  'close-button': spriteDef({ src: closeButton, cfg: { size: [8, 8], colsRows: [2, 1] } }),
  'cursor': spriteDef({ src: cursor, cfg: { size: [8, 11], colsRows: [2, 1] } }),
  'scoreboard': spriteDef({ src: scoreboard, cfg: { size: [51, 36] } }),
  'gold': spriteDef({ src: gold, cfg: { size: [8, 8] } }),
  'flag-colors': spriteDef({ src: flagColors, cfg: { size: [12, 12], colsRows: [2, 1] } }),
  'opinion-shield': spriteDef({ src: opinionShield, cfg: { size: [6, 7], colsRows: [3, 1] } }),
  'color-band': spriteDef({ src: colorBand, cfg: { size: [16, 16], colsRows: [3, 1] } }),
  'level-up': spriteDef({ src: levelUp, cfg: { size: [7, 11], colsRows: [5, 1] } }),
  'level-up-icons': spriteDef({ src: levelUpIcons, cfg: { size: [10, 11], colsRows: [2, 1] } }),
  'level-up-mini': spriteDef({ src: levelUpMini, cfg: { size: [5, 5] } }),
  'ribbon-frame': spriteDef({ src: ribbonFrame, cfg: { size: [16, 16], colsRows: [5, 5] } }),

  // Items
  'items': spriteDef({ src: items, cfg: { size: [16, 16], colsRows: [6, 1] } }),
  'beer-glass-lg': spriteDef({ src: beerGlassLg, cfg: { size: [16, 16], colsRows: [5, 5] } }),
  'beer-glass-sm': spriteDef({ src: beerGlassSm, cfg: { size: [10, 10], colsRows: [5, 5] } }),
  'bottle': spriteDef({ src: bottle, cfg: { size: [16, 16], colsRows: [3, 12] } }),

  // bottle-opening game
  'opening-game-bg': spriteDef({ src: openingGameBg, cfg: { size: [16, 16] } }),
  'bottle-xl': spriteDef({ src: bottleXl, cfg: { size: [109, 107], offset: [-103, -101] } }),
  'bottle-cap-xl': spriteDef({ src: bottleCapXl, cfg: { size: [14, 14], colsRows: [2, 1], offset: [-6, -6] } }),
  'bottle-opener-xl': spriteDef({ src: bottleOpenerXl, cfg: { size: [32, 31], offset: [-10, -10] } }),

  // beer-pouring game
  'cfe-bg-lg': spriteDef({ src: cfeBgLg, cfg: { size: [32, 32] } }),
  'beer-glass-xl': spriteDef({ src: beerGlassXl, cfg: { size: [76, 91], offset: [-4, 0] } }),
  'beer-xl': spriteDef({ src: beerXl, cfg: { size: [47, 74], colsRows: [15, 1] } }),
  'beer-foam-xl': spriteDef({ src: beerFoamXl, cfg: { size: [47, 86] } }),

  // Big building
  'fence': spriteDef({ src: fence, cfg: { size: [80, 38], offset: [0, -31], colsRows: [2, 1] } }),

  // Sakala
  'sakala-lamp': spriteDef({ src: sakalaLamp, cfg: { size: [15, 19], offset: [1, -41], colsRows: [2, 1] } }),
  'sakala-candle-lamp': spriteDef({ src: sakalaCandleLamp, cfg: { size: [25, 28], offset: [-5, -46], colsRows: [5, 1] } }),

  // Feenoks
  'feenoks-shelf': spriteDef({ src: feenoksShelf, cfg: { size: [34, 54], offset: [0, -48], colsRows: [3, 1] } }),
  'feenoks-fridge': spriteDef({ src: feenoksFridge, cfg: { size: [34, 48], offset: [0, -37], colsRows: [4, 1] } }),
  'feenoks-counter': spriteDef({ src: feenoksCounter, cfg: { size: [32, 32], offset: [0, -20], colsRows: [2, 1] } }),
  'feenoks-payment-counter': spriteDef({ src: feenoksPaymentCounter, cfg: { size: [32, 32], offset: [0, -20], colsRows: [4, 1] } }),
  'feenoks-counter-sideways': spriteDef({ src: feenoksCounterSideways, cfg: { size: [16, 40], offset: [0, -11], colsRows: [3, 1] } }),
  'feenoks-lady': spriteDef({ src: feenoksLady, cfg: { size: CHARACTER_SIZE, offset: CHARACTER_OFFSET } }),

  // Amicitia
  'amicitia-flag': spriteDef({ src: amicitiaFlag, cfg: { size: [22, 32], offset: [0, -49] } }),
};

export type SpriteName = keyof typeof imageFiles;

export class SpriteLibrary {
  private static sprites: Record<string, SpriteSheet> = {};

  public static async load() {
    for (const [name, { src, cfg }] of Object.entries(imageFiles)) {
      this.sprites[name] = new SpriteSheet(await this.loadImage(src), cfg);
    }
  }

  public static get(name: SpriteName): SpriteSheet {
    return this.sprites[name];
  }

  public static getSprite(name: SpriteName, coord?: Coord) {
    return this.get(name).getSprite(coord);
  }

  private static async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.src = src;
    });
  }
}
