import fs from "fs";
import path from "path";
import {generateServerCode} from "./generateServerCode.js";

export const createServerFile = (projectPath) => {
  const code = generateServerCode();

  const serverPath = path.join(projectPath, "server.js");
  fs.mkdirSync(path.dirname(serverPath), {recursive: true});
  fs.writeFileSync(serverPath, code);
};
