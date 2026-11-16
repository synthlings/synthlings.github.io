/**
 * The Synthlings JavaScript API: everything the MCP server, the league and the site are built from, for programs
 * that want to embed a band instead of talking MCP. See ARCHITECTURE.md for how the pieces fit.
 *
 *   import { createMusicServer, createSession, describeForAgent, submitTurn } from 'synthlings';
 *
 * Sessions are stored under $SYNTHLINGS_HOME (default: the package folder; `npx synthlings` uses ~/.synthlings).
 */

// MCP: the server behind `npx synthlings`, to connect to any transport.
export { createMusicServer } from './mcp/server.mjs';

// Bands and genres: the house casts (assets/cast/*.json with an id) and the genre presets.
export { BANDS, SEATS, bandIds } from './bands.mjs';
export { GENRES, PROGRESSIONS } from './score/library.mjs';

// Sessions: start a song, show a character its turn, apply a move, finish and render.
export {
  createSession,
  describeForAgent,
  finalizeSession,
  loadCast,
  loadState,
  seatGuests,
  startSong,
  submitTurn,
} from './session/service.mjs';

// The song format and the judge.
export { validateSong } from './score/schema.mjs';
export { derive } from './score/derive.mjs';
export { analyze, FLOOR, isConvention } from './score/analyze.mjs';

// The public league: pull-request sessions replayed from JSON files.
export { LeagueError, checkChange, checkLeague, listSessions, readSession, replaySession } from './league/league.mjs';
