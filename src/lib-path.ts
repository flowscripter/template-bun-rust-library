import os from "node:os";
import { suffix } from "bun:ffi";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import packageJson from "../package.json";
import { Glob } from "bun";

export async function getLibPath(libName: string) {
  const fullLibName = libName + "." + suffix;
  const installedLibFolder = path.join(os.homedir(), ".flowscripter", "lib");
  const installedLibPath = path.join(installedLibFolder, fullLibName);
  const installedLibFile = Bun.file(installedLibPath);

  const exists = await installedLibFile.exists();

  console.debug(`${installedLibPath} exists: ${exists}`);

  if (exists) {
    return installedLibPath;
  }
  console.debug('TMPDIR: ' + process.env.TMPDIR);

  const glob = new Glob("*");

  for (const file of glob.scanSync(process.env.TMPDIR)) {
      console.log(file);
  }

  console.debug(`packageJson.ffiLibBaseUri: ${packageJson.ffiLibBaseUri}`);

  // release build location
  if (packageJson.ffiLibBaseUri === "./target/release") {
    const builtLibPath = path.join(path.dirname(import.meta.dirname), "target", "release", fullLibName);

    console.debug(`process.env.PWD: ${process.env.PWD}`);
    console.debug(`process.cwd(): ${process.cwd()}`);

    console.debug(`builtLibPath: ${builtLibPath}`);

    const builtLibFile = Bun.file(builtLibPath);
    const exists = await builtLibFile.exists();

    console.debug(`${builtLibPath} exists: ${exists}`);

    if (exists) {
      return builtLibPath;
    }

    throw new Error(`Could not find ${builtLibPath}`);
  }

  // release download location
  const remotePath = path.join(packageJson.ffiLibBaseUri, fullLibName);

  await mkdir(installedLibFolder, { recursive: true });

  try {
    const result = await fetch(remotePath);

    await Bun.write(installedLibPath, result);
  } catch (e) {
    console.error(
      `Failed to download ${remotePath} to ${installedLibPath}: ${e}`,
    );
  }

  return installedLibPath;
}
