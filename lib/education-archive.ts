import "server-only";

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const BUNDLED_ARCHIVE_DIR = path.join(process.cwd(), "data", "feldenkrais-education-archive");

function resolveArchiveRoot(root: string | null | undefined) {
  if (!root || !existsSync(root)) {
    return null;
  }

  const directIndex = path.join(root, "content_index.jsonl");
  if (existsSync(directIndex)) {
    return root;
  }

  const latestRun = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => b.localeCompare(a))
    .find((dirname) => existsSync(path.join(root, dirname, "content_index.jsonl")));

  return latestRun ? path.join(root, latestRun) : null;
}

export function resolveEducationArchiveDir() {
  const envRoot = process.env.FE_CRAWL_ARCHIVE_DIR?.trim();
  return resolveArchiveRoot(envRoot) ?? resolveArchiveRoot(BUNDLED_ARCHIVE_DIR);
}
