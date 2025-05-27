import Database from "better-sqlite3";
import { resolve } from "node:path";

const dbPath = resolve(import.meta.dirname, "./users.db");
export const db = new Database(dbPath);
