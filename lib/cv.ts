import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Shape of data/cv.json (keys in English, visible values in Spanish).
 * Content is approved verbatim by the CV owner: code must read it,
 * never rewrite it.
 */
export interface CvContact {
  city: string;
  province: string;
  country: string;
  /** Display value, e.g. "+54 XXX XXX-XXXX". */
  phone: string;
  /** tel: value, e.g. "+549XXXXXXXXXX". */
  phoneLink: string;
  /** wa.me digits, e.g. "549XXXXXXXXXX" (country + area code + number). */
  whatsapp: string;
  email: string;
}

export interface CvExperience {
  from: number;
  /** null when the job is current; the UI composes the period text. */
  to: number | null;
  current: boolean;
  company: string;
  position: string;
  description: string;
}

export interface CvEducation {
  from: number;
  to: number;
  level: string;
  institution: string;
  degree: string;
}

export interface CvComputerSkill {
  name: string;
  level: string;
}

export interface Cv {
  name: string;
  photo: {
    /** Path relative to the project, e.g. "public/img-perfil.jpg". */
    original: string;
    web: string;
  };
  profile: string;
  contact: CvContact;
  experience: CvExperience[];
  education: CvEducation[];
  computerSkills: CvComputerSkill[];
}

const CV_PATH = "data/cv.json";

function fail(message: string): never {
  throw new Error(`[cv.json] ${message}`);
}

function requireString(raw: unknown, field: string): string {
  if (typeof raw !== "string" || raw.trim() === "") {
    fail(`missing or empty required field "${field}"`);
  }
  return raw;
}

function requireYear(raw: unknown, field: string): number {
  if (typeof raw !== "number" || !Number.isInteger(raw)) {
    fail(`field "${field}" must be an integer year, got ${JSON.stringify(raw)}`);
  }
  return raw;
}

function requireOptionalYear(raw: unknown, field: string): number | null {
  if (raw === null || raw === undefined) return null;
  return requireYear(raw, field);
}

function parseContact(raw: Record<string, unknown>): CvContact {
  return {
    city: requireString(raw.city, "contact.city"),
    province: requireString(raw.province, "contact.province"),
    country: requireString(raw.country, "contact.country"),
    phone: requireString(raw.phone, "contact.phone"),
    phoneLink: requireString(raw.phone_link, "contact.phone_link"),
    whatsapp: requireString(raw.whatsapp, "contact.whatsapp"),
    email: requireString(raw.email, "contact.email"),
  };
}

function parseExperience(raw: Record<string, unknown>, index: number): CvExperience {
  const where = `experience[${index}]`;
  return {
    from: requireYear(raw.from, `${where}.from`),
    to: requireOptionalYear(raw.to, `${where}.to`),
    current: typeof raw.current === "boolean" ? raw.current : false,
    company: requireString(raw.company, `${where}.company`),
    position: requireString(raw.position, `${where}.position`),
    description: requireString(raw.description, `${where}.description`),
  };
}

function parseEducation(raw: Record<string, unknown>, index: number): CvEducation {
  const where = `education[${index}]`;
  const from = requireYear(raw.from, `${where}.from`);
  const to = requireYear(raw.to, `${where}.to`);
  if (to < from) {
    fail(`${where}: "to" (${to}) is earlier than "from" (${from})`);
  }
  return {
    from,
    to,
    level: requireString(raw.level, `${where}.level`),
    institution: requireString(raw.institution, `${where}.institution`),
    degree: requireString(raw.degree, `${where}.degree`),
  };
}

function parseSkills(raw: Record<string, unknown> | undefined): CvComputerSkill[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => {
    const obj = item as Record<string, unknown>;
    return {
      name: requireString(obj.name, `computer_skills[${index}].name`),
      level: requireString(obj.level, `computer_skills[${index}].level`),
    };
  });
}

/**
 * Load and validate the CV content. Runs on the server at render time,
 * so any thrown error fails the build / revalidation with a clear message.
 */
export function loadCv(): Cv {
  let parsed: Record<string, unknown>;
  try {
    const file = readFileSync(path.join(process.cwd(), CV_PATH), "utf8");
    parsed = JSON.parse(file) as Record<string, unknown>;
  } catch (error) {
    fail(
      `cannot read ${CV_PATH}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  const photo = parsed.photo as Record<string, unknown> | undefined;
  if (!photo || typeof photo !== "object") {
    fail('missing "photo" object with "original" and "web" paths');
  }

  return {
    name: requireString(parsed.name, "name"),
    photo: {
      original: requireString(photo.original, "photo.original"),
      web: requireString(photo.web, "photo.web"),
    },
    profile: requireString(parsed.profile, "profile"),
    contact: parseContact(parsed.contact as Record<string, unknown>),
    experience: (parsed.experience as Record<string, unknown>[] | undefined)?.map(
      parseExperience,
    ) ?? [],
    education: (parsed.education as Record<string, unknown>[] | undefined)?.map(
      parseEducation,
    ) ?? [],
    computerSkills: parseSkills(parsed.computer_skills as Record<string, unknown> | undefined),
  };
}

/** "public/img-perfil-600x800.webp" -> "/img-perfil-600x800.webp" (URL form). */
export function assetUrl(projectPath: string): string {
  return `/${projectPath.replace(/^public\//, "")}`;
}
