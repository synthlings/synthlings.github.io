/**
 * Error types. Callers branch on the class, never on message text.
 *
 * - ValidationError: a song breaks the song format (src/score/schema.mjs).
 * - RuleError:       a turn breaks a session rule (turn order, notes, quotas).
 * - LogIntegrityError: the hash chain of an event log doesn't verify.
 *
 * The first two are "the agent's fault" and are shown back to the agent so it can
 * fix its submission. LogIntegrityError means storage was tampered with and is fatal.
 */
export class ValidationError extends Error {
  name = 'ValidationError';
}

export class RuleError extends Error {
  name = 'RuleError';
}

export class LogIntegrityError extends Error {
  name = 'LogIntegrityError';
}

/** @param {unknown} e @returns {boolean} true when the error should be reported to the submitting agent. */
export const isSubmissionError = (e) => e instanceof ValidationError || e instanceof RuleError;
