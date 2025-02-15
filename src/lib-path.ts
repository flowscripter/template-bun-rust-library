import os from "node:os";
import { suffix } from "bun:ffi";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import packageJson from "../package.json";

export async function getLibPath(libName: string) {
  const fullLibName = libName + "." + suffix;
  const installedLibFolder = path.join(os.homedir(), ".flowscripter", "lib");
  const installedLibPath = path.join(installedLibFolder, fullLibName);
  const installedLibFile = Bun.file(installedLibPath);
  const exists = await installedLibFile.exists();

  if (exists) {
    return installedLibPath;
  }

  // release build location
  if (packageJson.ffiLibBaseUri === "./target/release") {
    // handle windows paths by not actually using ffiLibBaseUri
    const builtLibPath = path.join(".", "target", "release", fullLibName);
    const builtLibFile = Bun.file(builtLibPath);
    const exists = await builtLibFile.exists();

    if (exists) {
      return builtLibPath;
    }
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
