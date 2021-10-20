import { random } from "lodash";
import { FlagColor, makeFlag } from "./FlagColors";

export interface Organization {
  name: string;
  colors: FlagColor[];
  establishedYear: number;
  establishedPlace: string;
  slogan: string;
}

const orgDef = (org: Organization) => org;

const orgs = {
  eus: orgDef({
    name: "EÜS",
    colors: makeFlag("sinine", "must", "valge"),
    establishedYear: 1870,
    establishedPlace: "Tartu",
    slogan: "Fortiter in re, sauviter in modo",
  }),
  vironia: orgDef({
    name: "Vironia",
    colors: makeFlag("violett", "must", "valge"),
    establishedYear: 1900,
    establishedPlace: "Riia",
    slogan: "Ühisus, kindlus, ausus",
  }),
  estica: orgDef({
    name: "Fraternitas Estica",
    colors: makeFlag("sinine", "roheline", "valge"),
    establishedYear: 1907,
    establishedPlace: "Tartu",
    slogan: "Teos õiglane ja vahvas, ustav sulle, Eesti rahvas",
  }),
  sakala: orgDef({
    name: "Sakala",
    colors: makeFlag("sinine", "violett", "valge"),
    establishedYear: 1909,
    establishedPlace: "Tartu",
    slogan: "Üks kõige, kõik ühe eest",
  }),
  ugala: orgDef({
    name: "Ugala",
    colors: makeFlag("must", "sinine", "valge"),
    establishedYear: 1913,
    establishedPlace: "Tartu",
    slogan: "Isamaa, sõprus, ausus",
  }),
  rotalia: orgDef({
    name: "Rotalia",
    colors: makeFlag("sinine", "must", "roheline"),
    establishedYear: 1913,
    establishedPlace: "Peterburg",
    slogan: "Eestimaa, mu isamaa",
  }),
  liviensis: orgDef({
    name: "Fraternitas Liviensis",
    colors: makeFlag("violett", "roheline", "valge"),
    establishedYear: 1918,
    establishedPlace: "Tartu",
    slogan: "Vendlus, ausus, hoolsus",
  }),
  leola: orgDef({
    name: "Leola",
    colors: makeFlag("violett", "kollane", "valge"),
    establishedYear: 1920,
    establishedPlace: "Tallinn",
    slogan: "Age quod agis",
  }),
  revelia: orgDef({
    name: "Revelia",
    colors: makeFlag("roheline", "must", "valge"),
    establishedYear: 1920,
    establishedPlace: "Tartu",
    slogan: "Üks kõige, kõik ühe eest",
  }),
  tehnola: orgDef({
    name: "Tehnola",
    colors: makeFlag("must", "roheline", "valge"),
    establishedYear: 1921,
    establishedPlace: "Tallinn",
    slogan: "Kindlus, ausus, vendlus",
  }),
  tartuensis: orgDef({
    name: "Fraternitas Tartuensis",
    colors: makeFlag("roheline", "valge", "violett"),
    establishedYear: 1929,
    establishedPlace: "Tartu",
    slogan: "Pidevas töös tõe valguses elurõõmsalt tulevikku",
  }),
  arminia: orgDef({
    name: "Arminia Dorpatensis",
    colors: makeFlag("must", "valge", "kuldne"),
    establishedYear: 1994,
    establishedPlace: "Tartu",
    slogan: "Jumal, vabadus, isamaa",
  }),
  filiaePatriae: orgDef({
    name: "Filiae Patriae",
    colors: makeFlag("valge", "punane", "roheline"),
    establishedYear: 1920,
    establishedPlace: "Tartu",
    slogan: "Eesti tütar, Eesti kodu, tugevasti seotud olgu",
  }),
  indla: orgDef({
    name: "Indla",
    colors: makeFlag("kirsipruun", "valge", "roheline"),
    establishedYear: 1924,
    establishedPlace: "Tartu",
    slogan: "Sõnasse kindlust, teosse ausust, kodule armastust",
  }),
  lembela: orgDef({
    name: "Lembela",
    colors: makeFlag("helebeez", "roheline", "violett"),
    establishedYear: 1924,
    establishedPlace: "Tartu",
    slogan: "Constantia ad finem ducit",
  }),
  amicitia: orgDef({
    name: "Amicitia",
    colors: makeFlag("lilla", "roheline", "kuldne"),
    establishedYear: 1924,
    establishedPlace: "Tartu",
    slogan: "Per aspera ad astra",
  }),
  sororitasEstoniae: orgDef({
    name: "Sororitas Estoniae",
    colors: makeFlag("valge", "roosa", "must"),
    establishedYear: 2011,
    establishedPlace: "Tallinn",
    slogan: "Teadmised on ilu",
  }),
};

export type OrgName = keyof typeof orgs;

export function getOrg(name: OrgName): Organization {
  return orgs[name];
}

export function allOrganizations(): Organization[] {
  return Object.values(orgs);
}

export function randomOrganization(): Organization {
  const orgs = allOrganizations();
  return orgs[random(orgs.length - 1)];
}