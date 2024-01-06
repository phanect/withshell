import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";
import { exec } from "./exec.js";
import type { NuAst } from "./types.js";

type NuScript = {
  path: string,
  functionNames: string[],
};
type FileToGenerate = {
  path: string,
  code: string,
};

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const getFunctions = (ast: NuAst): string[] => {
  const elements = ast[Symbol.iterator]();
  const functions: string[] = [];

  while (true) {
    const { content, shape } = elements.next().value;

    if (shape === "shape_internalcall" && content === "export def") {
      const { content, shape } = elements.next().value;

      if (shape === "shape_string") {
        functions.push(content);
      }
    }
  }
};

// ▼▼ TODO Replace values with real environments' (Get from a CLI arg) ▼▼
const srcDir = join(__dirname, "../example/src");
// ▲▲ TODO Replace values with real environments' ▲▲

const buildTemplates = (nuScripts: NuScript[]): FileToGenerate[] => [
  // main.nu
  {
    path: join(cwd(), "tmp/shell-integration/main.nu"),
    code: `
      ${ nuScripts.map(({ path }) => `use "${path}" *`).join("\n") }

      ${ nuScripts.map(({ functionNames }) =>
          functionNames.map(functionName => `
            def "main ${functionName}" [] {
              showGitUserInfo
            }
          `).join("\n")
      ) }

      def main [] {}
    `
  },
  // *.js or *.ts files corresponding to *.nu files
  ...nuScripts.map(({ path: nuPath, functionNames }) => ({
    path: nuPath.replace(/\.nu$/, ".shell-integration.ts"), // TODO in JS projects, the extension should be ".js"
    code: `
      import { exec } from "shell-integration";
      ${ functionNames.map(functionName => `
        export const ${functionName} = async (): Promise<void> => {
          await exec("npx nu \"${ nuPath }\" ${ functionName }")
        }
      `).join("\n")}
    `,
  }))
];

export const build = async (): Promise<void> => {
  const nuScripts: NuScript[] = await Promise.all(
    (await readdir(srcDir, { recursive: true }))
      .filter(fileName => fileName.endsWith(".nu"))
      .map(async (nuFileName) => {
        const nuFilePath = join(srcDir, nuFileName);
        const { stdout: astStr } = await exec(`npx nu --ide-ast ${nuFilePath}`);

        return {
          path: nuFilePath,
          functionNames: getFunctions(JSON.parse(astStr)), // TODO functionArgs?
        };
      })
  );

  for (const { path: genPath, code } of buildTemplates(nuScripts)) {
    await mkdir(dirname(genPath), { recursive: true });
    await writeFile(genPath, code);
  }
}
