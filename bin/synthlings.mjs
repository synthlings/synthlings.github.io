#!/usr/bin/env node
/**
 * The npm entry point: `npx synthlings` starts the Synthlings MCP server over stdio.
 * Sessions and renders go to ~/.synthlings (or $SYNTHLINGS_HOME), never into the package itself.
 */
import os from 'node:os';
import path from 'node:path';

process.env.SYNTHLINGS_HOME ??= path.join(os.homedir(), '.synthlings');
await import('./music-mcp.mjs');
