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

export function coordConstrain([x, y]: Coord, [minX, minY]: Coord, [maxX, maxY]: Coord): Coord {
  if (x < minX) {
    x = minX;
  }
  if (x > maxX) {
    x = maxX;
  }
  if (y < minY) {
    y = minY;
  }
  if (y > maxY) {
    y = maxY;
  }
  return [x, y];
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
