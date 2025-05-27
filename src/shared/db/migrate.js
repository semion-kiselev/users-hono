import Database from "better-sqlite3";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const dbPath = resolve(import.meta.dirname, "./users.db");
const migrationsPath = resolve(import.meta.dirname, "./migrations");

const db = new Database(dbPath);

console.log("Start migrations");

try {
  db.prepare("CREATE TABLE IF NOT EXISTS migration (id INTEGER PRIMARY KEY)").run();
  const lastRow = db.prepare("SELECT * FROM migration ORDER BY id DESC LIMIT 1").get();
  const lastSuccessMigrationId = lastRow?.id || 0;
  const fileNames = readdirSync(migrationsPath);

  const sortedFileNames = fileNames
    .map((fileName) => {
      const fileId = +fileName.split(".")[0];
      return [fileId, fileName];
    })
    .sort((a, b) => a[0] - b[0]);

  for (const [fileId, fileName] of sortedFileNames) {
    if (fileId > lastSuccessMigrationId) {
      const content = readFileSync(resolve(migrationsPath, fileName), "utf8");
      db.transaction(() => {
        db.exec(content);
        db.prepare("INSERT INTO migration (id) VALUES (?)").run(fileId);
      })();
    }
  }

  console.log("Done");
} catch (e) {
  console.log("Error");
  console.log(e);
}

db.close();
