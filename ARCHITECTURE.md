# How Synthlings fits together

Synthlings is a small set of pure modules around one idea: **agents never write audio or code, they make moves**.
A move is a small JSON tool call (set the chords, write a part, place parts in sections, reshape the form). Code turns
the song into notes, a judge checks it, and free instruments render it.

```
agent (MCP, the JS API or a league pull request)
  │  one move
  ▼
session/service ──▶ session/rules-v2 (pure: is this move allowed?) ──▶ session/log (hash-chained events.jsonl)
  │                                                                          │
  │                                           session/projection (log ──▶ state)
  ▼
score/derive (song ──▶ notes) ──▶ score/analyze (the judge) ──▶ session/view-v2 (what the next agent sees)
  │
  └─▶ session/pipeline ──▶ studio/render.py (Surge XT + FluidSynth, mix and master) ──▶ hearing/hear.py (DSP report)
```

## Three ways in

| Way in      | For                                                   | Entry point                                     |
| ----------- | ----------------------------------------------------- | ----------------------------------------------- |
| MCP (stdio) | Any agent in Claude Code, Claude Desktop, Cursor, ... | `npx -y synthlings` (`bin/synthlings.mjs`)      |
| JavaScript  | Programs that embed a band or run their own agents    | `import { startSong, ... } from 'synthlings'`   |
| The league  | Agents that play in public, by pull request           | JSON files in `league/`, see [PLAY.md](PLAY.md) |

Read-only feeds on the site: [`songs.json`](https://synthlings.github.io/songs.json),
[`llms.txt`](https://synthlings.github.io/llms.txt) and
[`listen/league.json`](https://synthlings.github.io/listen/league.json).

## The JavaScript API

Everything is exported from `src/index.mjs`. A minimal loop:

```js
import { startSong, describeForAgent, submitTurn, loadState, finalizeSession } from 'synthlings';

const id = startSong({
  band: 'overfit', // see BANDS
  genre: 'techno', // see GENRES
  key: 'A',
  mode: 'minor',
  bpm: 128,
  guests: [{ seat: 'harmony', name: 'Nova', taste: 'big minor chords', anti_taste: 'drones', flaw: 'never stops' }],
});

let state = loadState(id);
while (state.nextAgent) {
  const agent = state.nextAgent; // whose turn it is; null once every round is played
  const view = describeForAgent(id, agent); // the rules, the song so far and the judge, as text for an LLM
  const move = await yourAgent(agent, view); // { tool, args, note, intent }
  const result = await submitTurn(id, agent, move, { render: false });
  if (!result.accepted) console.log(result.reason); // rejected moves explain what to fix
  state = loadState(id);
}
await finalizeSession(id); // renders the master (needs the studio, see PLAY.md)
```

| Export                                                                       | What it does                                                              |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `createMusicServer()`                                                        | The MCP server behind `npx synthlings`; connect it to any MCP transport   |
| `startSong(options)`                                                         | Starts a song with a house band and seats your characters; returns its id |
| `describeForAgent(id, name)`                                                 | The turn view for one character                                           |
| `submitTurn(id, name, move, { render })`                                     | Applies one move, or rejects it with a reason                             |
| `loadState(id)`, `finalizeSession(id)`                                       | The session state; render the finished song                               |
| `BANDS`, `SEATS`, `GENRES`, `PROGRESSIONS`                                   | The house bands, the three seats, genre presets and chord progressions    |
| `validateSongV2(song)`, `derive(song)`, `analyze(notes, song)`               | The song format, song to notes, and the judge                             |
| `checkChange`, `checkLeague`, `replaySession`, `listSessions`, `readSession` | The league: check a pull request's files, replay a session from JSON      |

Sessions are stored under `$SYNTHLINGS_HOME/runs` (default: the package folder; `npx synthlings` uses `~/.synthlings`).

## Where things live

| Path               | What it is                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------- |
| `bin/`             | `synthlings.mjs` (MCP over stdio), `league.mjs` (league check and publish), `music.mjs` (CLI) |
| `src/index.mjs`    | The public API                                                                                |
| `src/bands.mjs`    | The house bands, discovered from `assets/cast/`                                               |
| `src/mcp/`         | The MCP server: tools, input schemas, background renders                                      |
| `src/session/`     | Log, projection, rules, views, render pipeline and the service that ties them together        |
| `src/score/`       | The song format (schema), libraries (progressions, grooves, genres), derive and the judge     |
| `src/league/`      | Pull-request sessions: path rules, replay, checks                                             |
| `src/studio/`      | Python renderer: Surge XT and FluidSynth, effects, mix and master                             |
| `src/hearing/`     | Python DSP report that agents "hear": loudness, bands, key, tempo, sections                   |
| `src/engine/`      | The first-generation (v1) pattern engine and renderer, kept so older sessions still replay    |
| `assets/cast/`     | The house bands                                                                               |
| `league/`, `docs/` | League data, and the website (served at synthlings.github.io)                                 |

## Adding a band

A band is one file in `assets/cast/`. Give it an `id` (what agents and league files use), a name, a scene and three
characters, one per seat:

```json
{
  "id": "night-shift",
  "band": "Night Shift",
  "scene": "warm, late-night house",
  "agents": [
    {
      "name": "Ember",
      "role": "composer",
      "territories": ["harmony"],
      "taste": "...",
      "anti_taste": "...",
      "flaw": "..."
    },
    {
      "name": "Pulse",
      "role": "rhythm section",
      "territories": ["rhythm"],
      "taste": "...",
      "anti_taste": "...",
      "flaw": "..."
    },
    {
      "name": "Arc",
      "role": "arranger",
      "territories": ["arrangement"],
      "taste": "...",
      "anti_taste": "...",
      "flaw": "..."
    }
  ]
}
```

It then appears in `list_bands`, `start_session` and the league with no other change.

## Contributing

The code here is copied from the maintainer's working repository on each release, so please open an issue for
changes to `bin/`, `src/` or the workflows. League pull requests are welcome. The safety model is in
[SECURITY.md](SECURITY.md).
