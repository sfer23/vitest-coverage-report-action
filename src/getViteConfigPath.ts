import * as core from "@actions/core";
import path from "node:path";
import { constants, promises as fs } from "fs";
import { stripIndent } from "common-tags";

const testFilePath = async (workingDirectory: string, filePath: string) => {
  const resolvedPath = path.resolve(workingDirectory, filePath);
  await fs.access(resolvedPath, constants.R_OK);
  return resolvedPath;
};

const defaultPaths = [
  "vitest.config.ts",
  "vitest.config.mts",
  "vitest.config.cts",
  "vitest.config.js",
  "vitest.config.mjs",
  "vitest.config.cjs",
  "vite.config.ts",
  "vite.config.mts",
  "vite.config.cts",
  "vite.config.js",
  "vite.config.mjs",
  "vite.config.cjs",
];

const getViteConfigPath = async (workingDirectory: string, input: string) => {
  try {
    if (input === "") {
      return await Promise.any(
        defaultPaths.map((filePath) => testFilePath(workingDirectory, filePath))
      );
    } 
    
    return await testFilePath(workingDirectory, input);
  } catch (error) {
    core.setFailed(stripIndent`
          Failed to read vite config file"${workingDirectory}/${input}" or any of the default locations.
          Make sure you provide the vite-config-path option if you're using a non-default location or name of your config file.
      `);
    throw new Error(
      `Unable to find config file "${workingDirectory}/${input}".`,
      {
        cause: error,
      }
    );
  }
};

export { getViteConfigPath };
