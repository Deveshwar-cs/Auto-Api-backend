import fs from "fs";
import path from "path";
import {generateDbCode} from "./generateDbCode.js";

export const createDbFile = (projectPath) => {
  const code = generateDbCode();

  const dbPath = path.join(projectPath, "config", "db.js");

  fs.mkdirSync(path.dirname(dbPath), {recursive: true});
  fs.writeFileSync(dbPath, code);
};
