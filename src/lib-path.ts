import os from "node:os";
import { suffix } from "bun:ffi";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import packageJson from "../package.json";

export function buildLocalLibName(libName: string, libSuffix: string): string {
  const base = `${libName}.${libSuffix}`;
  return libSuffix === "dll" ? base : `lib${base}`;
}

export function buildRemoteLibName(libName: string, libSuffix: string, arch: string): string {
  if (libSuffix === "so") return `${arch}.${libSuffix}`;
  if (libSuffix === "dll") return `${libName}.${arch}.${libSuffix}`;
  return buildLocalLibName(libName, libSuffix);
}

export function buildRemoteUrl(baseUri: string, remoteLibName: string): string {
  const base = baseUri.endsWith("/") ? baseUri : baseUri + "/";
  return new URL(remoteLibName, base).href;
}

export async function getLibPath(libName: string) {
  const fullLibName = buildLocalLibName(libName, suffix);

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

  const remoteLibName = buildRemoteLibName(libName, suffix, process.arch);
  const remotePath = buildRemoteUrl(packageJson.ffiLibBaseUri, remoteLibName);

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
