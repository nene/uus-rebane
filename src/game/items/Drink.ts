export interface Drink {
  name: string;
  withName: string;
  description: string;
  price: number;
  bottleSpriteIndex: number;
  alcohol: number; // How much alcohol it has (ABV %)
  foam: Foaminess; // How much foam does it generate when pouring
  capStrength: number; // How hard is it to open the bottle (0 ... 1)
  color: DrinkColor;
}

export enum DrinkColor {
  water = 0,
  lemonade = 1,
  light = 2,
  dark = 3,
  red = 4,
}

export interface Foaminess {
  min: number;
  max: number;
}

const foamLevel: Foaminess[] = [
  { min: 0.00, max: 0.00 }, // #0
  { min: 0.00, max: 0.10 }, // #1
  { min: 0.05, max: 0.20 }, // #2
  { min: 0.10, max: 0.40 }, // #3
  { min: 0.15, max: 0.60 }, // #4
  { min: 0.20, max: 0.90 }, // #5
];

// Typecheck helper for the below definitions
const drinkDef = (x: Drink) => x;

const drinks = {
  "water": drinkDef({
    name: "Vesi",
    withName: "veega",
    description: "Seda tuleb kraanist lõputult.",
    price: 0,
    bottleSpriteIndex: 11,
    alcohol: 0,
    foam: foamLevel[0],
    capStrength: 0,
    color: DrinkColor.water,
  }),
  "limonaad": drinkDef({
    name: "Limpa limonaad",
    withName: "limonaadiga",
    description: "See magus jook kipub šoppeni põhja kleepuma.",
    price: 1,
    bottleSpriteIndex: 7,
    alcohol: 0,
    foam: foamLevel[0],
    capStrength: 0,
    color: DrinkColor.lemonade,
  }),
  "kriek": drinkDef({
    name: "Kriek",
    withName: "kriekiga",
    description: "Seda hõrku nestet libistavad ka naiskorporandid.",
    price: 6,
    bottleSpriteIndex: 6,
    alcohol: 0.8, // 3.5,
    foam: foamLevel[4],
    capStrength: 5,
    color: DrinkColor.red,
  }),
  "pilsner": drinkDef({
    name: "Pilsner",
    withName: "pilkuga",
    description: "EÜSnikute lemmiknaps.",
    price: 1,
    bottleSpriteIndex: 4,
    alcohol: 1, // 4.2,
    foam: foamLevel[1],
    capStrength: 1,
    color: DrinkColor.light,
  }),
  "heineken": drinkDef({
    name: "Heineken",
    withName: "heinekeniga",
    description: "Väljamaine rüübe rohelises pudelis.",
    price: 3,
    bottleSpriteIndex: 2,
    alcohol: 1.6, // 5,
    foam: foamLevel[1],
    capStrength: 3,
    color: DrinkColor.light,
  }),
  "tommu-hiid": drinkDef({
    name: "Tõmmu hiid",
    withName: "tõmmu hiiuga",
    description: "Vana vilistlase rammujook.",
    price: 4,
    bottleSpriteIndex: 5,
    alcohol: 1.87, // 4.7,
    foam: foamLevel[4],
    capStrength: 2,
    color: DrinkColor.dark,
  }),
  "alexander": drinkDef({
    name: "Alexander",
    withName: "sassiga",
    description: "Sassi läheb kui loed mitu pudelit sai joodud.",
    price: 2,
    bottleSpriteIndex: 1,
    alcohol: 2, // 5.2,
    foam: foamLevel[2],
    capStrength: 2,
    color: DrinkColor.light,
  }),
  "special": drinkDef({
    name: "Special",
    withName: "specialiga",
    description: "Eriline jook puhuks kui paremat pole võtta.",
    price: 3,
    bottleSpriteIndex: 3,
    alcohol: 2, // 5.2,
    foam: foamLevel[1],
    capStrength: 3,
    color: DrinkColor.light,
  }),
  "paulaner": drinkDef({
    name: "Hefeweisen",
    withName: "nisukaga",
    description: "Saksamaine nisumärjuke (bratwursti kõrvale).",
    price: 5,
    bottleSpriteIndex: 8,
    alcohol: 2.5, // 5.5,
    foam: foamLevel[4],
    capStrength: 4,
    color: DrinkColor.light,
  }),
  "porter": drinkDef({
    name: "Šokolaadi porter",
    withName: "porteriga",
    description: "Väidetavalt muudab suure mehe päkapikuks.",
    price: 4,
    bottleSpriteIndex: 10,
    alcohol: 3.6, // 6.9,
    foam: foamLevel[5],
    capStrength: 2,
    color: DrinkColor.dark,
  }),
  "bock": drinkDef({
    name: "Double Bock",
    withName: "bockiga",
    description: "Revelia kvarteriturniiri erikülaline.",
    price: 3,
    bottleSpriteIndex: 9,
    alcohol: 4, // 7,
    foam: foamLevel[3],
    capStrength: 3,
    color: DrinkColor.light,
  }),
}

export type DrinkType = keyof typeof drinks;

export function getDrink(type: DrinkType): Drink {
  return drinks[type];
}

export function getAllDrinks(): Drink[] {
  return Object.values(drinks);
}
