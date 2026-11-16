/**
 * Every filesystem location the spike uses, resolved once from the package root.
 * Nothing else in the codebase builds paths from `import.meta.url`.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// SYNTHLINGS_HOME moves everything the engine writes out of the package (bin/synthlings.mjs sets it to
// ~/.synthlings, since an npx install lives in npm's cache). MUSIC_RUNS_DIR lets tests write sessions somewhere
// disposable.
const HOME = process.env.SYNTHLINGS_HOME ? path.resolve(process.env.SYNTHLINGS_HOME) : ROOT;
const RUNS = process.env.MUSIC_RUNS_DIR ? path.resolve(process.env.MUSIC_RUNS_DIR) : path.join(HOME, 'runs');

export const PATHS = Object.freeze({
  root: ROOT,
  casts: path.join(ROOT, 'assets', 'cast'),
  runs: RUNS,
  out: path.join(HOME, 'out'),
  hearScript: path.join(ROOT, 'src', 'hearing', 'hear.py'),
  studioScript: path.join(ROOT, 'src', 'studio', 'render.py'),
});
