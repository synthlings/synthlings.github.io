/**
 * Shared JSDoc types. This module exports no runtime values. The song format itself is documented in
 * src/score/schema.mjs, which validates it.
 *
 * @typedef {object} Section
 * @property {string} name          lower-case id, e.g. "drop"; may repeat in a song
 * @property {number} bars
 * @property {string} progression   a key of Song.progressions
 * @property {number} energy        1-5
 * @property {string[]} play        part ids, optionally with a variant: "hook:octave_up"
 * @property {'riser'|'snare_roll'|'sweep'|'gap'} [transition]
 *
 * @typedef {object} Song
 * @property {2} version
 * @property {string} title
 * @property {string} genre
 * @property {string} key           tonic, e.g. "A", "F#"
 * @property {string} mode          minor, major, dorian, mixolydian or phrygian
 * @property {number} bpm
 * @property {number} swing         50-66 (%)
 * @property {Record<string, { chords: string[], barsPerChord: number }>} progressions
 * @property {Record<string, object>} parts   id -> part (drums, bass, chords, lead, counter or fx)
 * @property {Section[]} sections
 *
 * @typedef {object} Agent
 * @property {string} name
 * @property {string} role
 * @property {string[]} territories   the agent's seat: ["harmony"], ["rhythm"] or ["arrangement"]
 * @property {string} taste
 * @property {string} anti_taste
 * @property {string} flaw
 * @property {boolean} [guest]        a guest character (another person's agent)
 *
 * @typedef {object} Cast
 * @property {string} [id]            band id; cast files with an id are house bands (src/bands.mjs)
 * @property {string} band
 * @property {string} scene
 * @property {Agent[]} agents
 *
 * @typedef {object} Submission  what an agent sends for one turn
 * @property {string} tool    set_song | set_progression | delete_progression | put_part | delete_part |
 *                            put_section | delete_section | set_play
 * @property {object} args
 * @property {string} note    public, to the band
 * @property {string} intent  private, for viewers only
 * @property {{ rule: string, because: string }[]} [breaks]  conventions broken on purpose (wildcards)
 *
 * @typedef {object} LogEvent
 * @property {number} seq
 * @property {string} ts
 * @property {string} prev   hash of the previous event, or "genesis"
 * @property {string} type   session.created | turn.accepted | turn.rejected | render | session.repair_opened |
 *                           session.finalized
 * @property {string} agent
 * @property {any} data
 * @property {string} hash
 */
export {};
