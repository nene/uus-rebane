import { constrain } from "./utils/constrain";

export type Coord = [number, number];
export type Rect = { coord: Coord, size: Coord };

export function coordAdd(a: Coord, b: Coord): Coord {
  return [a[0] + b[0], a[1] + b[1]];
};

export function coordSub(a: Coord, b: Coord): Coord {
  return [a[0] - b[0], a[1] - b[1]];
}

export function coordMul(a: Coord, b: Coord): Coord {
  return [a[0] * b[0], a[1] * b[1]];
}

export function coordDiv(a: Coord, b: Coord): Coord {
  return [a[0] / b[0], a[1] / b[1]];
}

export function coordEq(a: Coord, b: Coord): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export function coordConstrain([x, y]: Coord, { coord: [minX, minY], size }: Rect): Coord {
  const [maxX, maxY] = coordAdd([minX, minY], size);
  return [
    constrain(x, { min: minX, max: maxX }),
    constrain(y, { min: minY, max: maxY }),
  ];
}

// Takes any coord of any numbers and converts it to a coord that can only contain numbers -1, 0, 1
// coordUnit([-5, 8]) --> [-1, 1]
// coordUnit([0, 0.3]) -> [0, 1]
export function coordUnit(coord: Coord): Coord {
  return coord.map((x) => x > 0 ? 1 : (x < 0 ? -1 : 0)) as Coord;
}

export function coordDistance(coord1: Coord, coord2: Coord): number {
  const [a, b] = coordSub(coord1, coord2).map(Math.abs);
  return Math.sqrt(a * a + b * b);
}

export function coordFloor(coord: Coord): Coord {
  return coord.map(Math.floor) as Coord;
}

export function isCoordInRect([x, y]: Coord, { coord: [x1, y1], size }: Rect): boolean {
  const [x2, y2] = coordAdd([x1, y1], coordSub(size, [1, 1]));
  return x >= x1 && y >= y1 && x <= x2 && y <= y2;
}

export function rectOverlaps({ coord: a1, size: aSize }: Rect, { coord: b1, size: bSize }: Rect): boolean {
  const a2 = coordAdd(a1, aSize);
  const b2 = coordAdd(b1, bSize);

  const xOverlaps = a1[0] < b2[0] && a2[0] > b1[0];
  const yOverlaps = a1[1] < b2[1] && a2[1] > b1[1];
  return xOverlaps && yOverlaps;
}

export function rectContains(container: Rect, rect: Rect): boolean {
  return isCoordInRect(rect.coord, container) && isCoordInRect(coordAdd(rect.coord, coordSub(rect.size, [1, 1])), container);
}

export function rectGrow({ coord, size }: Rect, padding: Coord): Rect {
  return { coord: coordSub(coord, padding), size: coordAdd(size, coordMul(padding, [2, 2])) };
}

export function rectTranslate({ coord, size }: Rect, offset: Coord): Rect {
  return { coord: coordAdd(coord, offset), size };
}

export function rectDistance({ coord: a1, size: aSize }: Rect, { coord: b1, size: bSize }: Rect): number {
  const a2 = coordAdd(a1, aSize);
  const b2 = coordAdd(b1, bSize);

  const xDistance = a2[0] < b1[0] ? b1[0] - a2[0] : (b2[0] < a1[0] ? a1[0] - b2[0] : 0);
  const yDistance = a2[1] < b1[1] ? b1[1] - a2[1] : (b2[1] < a1[1] ? a1[1] - b2[1] : 0);

  return Math.sqrt(xDistance ** 2 + yDistance ** 2);
}

export function rectCenter(rect: Rect, container: Rect): Rect {
  return rectAlign(rect, container, "center");
}

export type Alignment = "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

export function rectAlign(rect: Rect, container: Rect, align: Alignment): Rect {
  switch (align) {
    case "top": return doRectAlign(rect, container, center, start);
    case "left": return doRectAlign(rect, container, start, center);
    case "bottom": return doRectAlign(rect, container, center, end);
    case "right": return doRectAlign(rect, container, end, center);
    case "top-left": return doRectAlign(rect, container, start, start);
    case "top-right": return doRectAlign(rect, container, end, start);
    case "bottom-left": return doRectAlign(rect, container, start, end);
    case "bottom-right": return doRectAlign(rect, container, end, end);
    case "center": return doRectAlign(rect, container, center, center);
  }
}

type AlignFn = (len: number, containerLen: number) => number;
const center: AlignFn = (len, containerLen) => Math.floor((containerLen - len) / 2);
const start: AlignFn = () => 0;
const end: AlignFn = (len, containerLen) => containerLen - len;

function doRectAlign(rect: Rect, container: Rect, xAlign: AlignFn, yAlign: AlignFn): Rect {
  const [rWidth, rHeight] = rect.size;
  const [cWidth, cHeight] = container.size;

  const offset: Coord = [xAlign(rWidth, cWidth), yAlign(rHeight, cHeight)];
  return { coord: coordAdd(container.coord, offset), size: rect.size };
}

const TILE_SIZE: Coord = [16, 16];

export function tileToScreenCoord(tileCoord: Coord): Coord {
  return coordMul(tileCoord, TILE_SIZE);
}

export function screenToTileCoord(screenCoord: Coord): Coord {
  return coordFloor(screenToFractionalTileCoord(screenCoord));
}

export function screenToFractionalTileCoord(screenCoord: Coord): Coord {
  return coordDiv(screenCoord, TILE_SIZE);
}

export const tileToScreenRect = ({ coord, size }: Rect): Rect => ({
  coord: tileToScreenCoord(coord),
  size: tileToScreenCoord(size),
});

// Useful for placing characters at the center of a tile
export function tileCenterCoord(coord: Coord): Coord {
  return coordAdd(tileToScreenCoord(coord), [8, 8]);
}
