import { Coord, tileToScreenCoord } from "../Coord";
import { LocationFactory, LocationName } from "./LocationFactory";
import { Wall } from "../furniture/Wall";
import { Door } from "../furniture/Door";
import { TiledBackground } from "./TiledBackground";
import { Lamp } from "../furniture/Lamp";
import { Painting } from "../furniture/Painting";
import { Pianino } from "../furniture/Pianino";

const CFE_HALL_SIZE: Coord = [23, 17]; // Size in tiles

export class CfeHallLocationFactory implements LocationFactory {
  private background = new TiledBackground([
    "#22222222222222########",
    "6tttttttttttttt4#######",
    "6mmmmmmmmmmmmmm4#######",
    "6bbbbbbbbbbbbbb1222222#",
    "6______________ttttttt4",
    "6______________mmmmmmm4",
    "6______________bbbbbbb4",
    "6_____________________4",
    "6_____________________4",
    "6_____________________4",
    "6_____________________4",
    "6_____________________4",
    "6_____________________4",
    "6_____________________4",
    "6_____________________4",
    "6_____________________4",
    "#888888888888888888888#",
  ]);

  private objects = [
    new Wall({ coord: tileToScreenCoord([0, 1]), size: tileToScreenCoord([22, 3]) }),
    new Wall({ coord: tileToScreenCoord([15, 4]), size: tileToScreenCoord([8, 3]) }),
    new Wall({ coord: tileToScreenCoord([0, 0]), size: tileToScreenCoord([1, 17]) }),
    new Wall({ coord: tileToScreenCoord([1, 16]), size: tileToScreenCoord([22, 1]) }),
    new Wall({ coord: tileToScreenCoord([22, 7]), size: tileToScreenCoord([1, 9]) }),

    new Lamp(tileToScreenCoord([3, 4]), true),
    new Painting(tileToScreenCoord([4, 4]), "coat-of-arms"),
    new Lamp(tileToScreenCoord([8, 4]), true),

    new Door({
      coord: tileToScreenCoord([10, 4]),
      spriteName: "door-large",
      from: "cfe-hall",
      to: "outdoors",
    }),
    new Lamp(tileToScreenCoord([12, 4]), true),
    new Painting(tileToScreenCoord([13, 4]), "polonia-cartel"),
    new Pianino(tileToScreenCoord([13, 4])),

    new Door({
      coord: tileToScreenCoord([16, 7]),
      spriteName: "door",
      from: "cfe-hall",
      to: "cfe-cellar",
    }),
    new Lamp(tileToScreenCoord([18, 7]), true),
  ];

  getName(): LocationName {
    return "cfe-hall";
  }

  getSize(): Coord {
    return tileToScreenCoord(CFE_HALL_SIZE);
  }

  getBackground() {
    return this.background;
  }

  getObjects() {
    return this.objects;
  }
}
