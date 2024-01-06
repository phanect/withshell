import { exec as execCallback } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

type ExecOptions = {
  suppressOutput: boolean,
};

export const exec = async (command: string, { suppressOutput = true }: ExecOptions): Promise<{ stdout: string, stderr: string }> =>
  new Promise((resolve, reject) =>
    execCallback(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }

      resolve({ stdout, stderr });
    })
  );

