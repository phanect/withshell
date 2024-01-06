import { exec as execCallback } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const exec = async (command: string): Promise<{ stdout: string, stderr: string }> =>
  new Promise((resolve, reject) =>
    execCallback(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }

      resolve({ stdout, stderr });
    })
  );

