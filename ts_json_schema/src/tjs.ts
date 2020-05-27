import { readdirSync, writeFileSync, stat } from "fs";
import { resolve, parse } from "path";
import { promisify } from "util";
import * as TJS from "typescript-json-schema";
import * as stringify from "json-stable-stringify";
const toSingleQuotes = require("to-single-quotes");

const statPromisify = promisify(stat),
  settings: TJS.PartialArgs = {
    required: true,
  },
  compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true,
  };

export function run(dirName: string) {
  let files = readdirSync(dirName);
  if (files.length) {
    files.forEach(async (fileName) => {
      let resolvePath = resolve(dirName, fileName),
        filePath = parse(resolvePath),
        stats = await statPromisify(resolvePath);
      if (stats.isDirectory()) {
        run(resolve(dirName, fileName));
      } else if (filePath.ext === ".ts") {
        assertSchema(resolvePath, filePath.name);
      }
    });
  }
}

function assertSchema(resolvePath: string, type: string) {
  let program = TJS.getProgramFromFiles([resolvePath], compilerOptions),
    schema = TJS.generateSchema(program, type, settings);
  writeFileSync(
    `${resolvePath}.txt`,
    toSingleQuotes(stringify(schema, { space: 4 }))
  );
}
