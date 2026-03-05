import fs from "node:fs";
import path from "node:path";
import { Promo, normCode } from "@/lib/promoStore";

const DATA_DIR = path.join(process.cwd(), "data");
const PROMO_FILE = path.join(DATA_DIR, "promos.json");

export function findPromoByCode(codeRaw: string): Promo | null {
    const code = normCode(codeRaw);
    if (!fs.existsSync(PROMO_FILE)) return null;
    const all = JSON.parse(fs.readFileSync(PROMO_FILE, "utf8")) as Promo[];
    return all.find(p => normCode(p.code) === code) || null;
}