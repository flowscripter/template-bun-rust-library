import os from "node:os";
import { suffix } from "bun:ffi";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import packageJson from "../package.json";

export async function getLibPath(libName: string) {
  let fullLibName = libName + "." + suffix;

  if (suffix !== "dll") {
    fullLibName = "lib" + fullLibName;
  }

  // look in release build location
  const builtLibPath = path.join("target", "release", fullLibName);

  console.debug(`builtLibPath: ${builtLibPath}`);

  const builtLibFile = Bun.file(builtLibPath);
  let exists = await builtLibFile.exists();

  console.debug(`${builtLibPath} exists: ${exists}`);

  if (exists) {
    return builtLibPath;
  }

  // look in release installed location
  const installedLibFolder = path.join(os.homedir(), ".flowscripter", "lib");
  const installedLibPath = path.join(installedLibFolder, fullLibName);
  const installedLibFile = Bun.file(installedLibPath);

  exists = await installedLibFile.exists();

  console.debug(`${installedLibPath} exists: ${exists}`);

  if (exists) {
    return installedLibPath;
  }

  console.debug(`packageJson.ffiLibBaseUri: ${packageJson.ffiLibBaseUri}`);

  // look in release download location
  // release asset naming differs from the local dlopen name:
  //   Linux:   {arch}.so       (e.g. x64.so, arm64.so)
  //   macOS:   lib{name}.dylib (unchanged)
  //   Windows: {name}.{arch}.dll
  const arch = process.arch;
  let remoteLibName: string;
  if (suffix === "so") {
    remoteLibName = `${arch}.${suffix}`;
  } else if (suffix === "dll") {
    remoteLibName = `${libName}.${arch}.${suffix}`;
  } else {
    remoteLibName = fullLibName;
  }

  const base = packageJson.ffiLibBaseUri.endsWith("/")
    ? packageJson.ffiLibBaseUri
    : packageJson.ffiLibBaseUri + "/";
  const remotePath = new URL(remoteLibName, base).href;

  console.debug(`remotePath: ${remotePath}`);

  await mkdir(installedLibFolder, { recursive: true });

  try {
    const result = await fetch(remotePath);

    await Bun.write(installedLibPath, result);
  } catch (e) {
    console.error(`Failed to download ${remotePath} to ${installedLibPath}: ${e}`);
  }

  return installedLibPath;
}
