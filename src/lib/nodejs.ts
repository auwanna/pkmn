import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function write(path: string, data: string) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, data, "utf-8");
}

export async function read<T>(path: string) {
  const contents = await readFile(path, { encoding: "utf-8" });
  return JSON.parse(contents) as T;
}

export async function remove(path: string) {
  await rm(path, { force: true });
}

export function stringify<T>(data: T) {
  return JSON.stringify(data, null, 2);
}
