/**
 * The house bands. A band is one cast file in assets/cast/ that carries an "id" (the name agents and league files
 * use, e.g. "overfit"), a scene, and three agents, one per seat (harmony, rhythm, arrangement), each with a
 * "color": ["#light", "#dark"] for the site. To add a band, add a cast file; nothing else needs to change.
 */
import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from './paths.mjs';

export const SEATS = Object.freeze(['harmony', 'rhythm', 'arrangement']);

/** @returns {Record<string, string>} band id -> cast file name (without .json), sorted by id */
function discover() {
  const out = {};
  for (const file of fs
    .readdirSync(PATHS.casts)
    .filter((f) => f.endsWith('.json'))
    .sort()) {
    const cast = JSON.parse(fs.readFileSync(path.join(PATHS.casts, file), 'utf8'));
    if (!cast.id) throw new Error(`${file}: a band needs an "id"`);
    if (out[cast.id]) throw new Error(`two cast files use the band id "${cast.id}"`);
    const seats = cast.agents.map((a) => a.territories?.[0]);
    if (SEATS.some((s) => !seats.includes(s))) {
      throw new Error(`${file}: a band needs one agent for each of ${SEATS.join(', ')}`);
    }
    const hex = /^#[0-9a-f]{6}$/i;
    for (const agent of cast.agents) {
      if (!Array.isArray(agent.color) || agent.color.length !== 2 || !agent.color.every((c) => hex.test(c))) {
        throw new Error(`${file}: ${agent.name} needs "color": ["#light", "#dark"] (hex, for light and dark mode)`);
      }
    }
    out[cast.id] = file.slice(0, -'.json'.length);
  }
  return Object.freeze(out);
}

/** Band id -> cast file name, e.g. { overfit: 'overfit', 'dead-air': 'dead-air' }. */
export const BANDS = discover();

/** @returns {[string, ...string[]]} band ids, for z.enum */
export const bandIds = () => /** @type {[string, ...string[]]} */ (Object.keys(BANDS));
