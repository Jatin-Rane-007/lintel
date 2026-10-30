/**
 * Clerk reports a failure in two shapes: a typed `ClerkError` from the resource
 * methods, and an API response error that carries a list of field errors. The
 * specific code and the sentence worth showing a person usually sit one level
 * down, so the screens read failures through these two helpers.
 */

export type ClerkFailure = {
  code?: string;
  message?: string;
  longMessage?: string;
  errors?: { code?: string; message?: string; longMessage?: string }[];
} | null;

export const failureCode = (failure: ClerkFailure) => failure?.errors?.[0]?.code ?? failure?.code;

/** Clerk's own copy is already plain and blame-free, so it wins over ours. */
export const failureMessage = (failure: ClerkFailure, fallback: string) =>
  failure?.errors?.[0]?.longMessage ?? failure?.longMessage ?? failure?.message ?? fallback;

/** Mirrors `auth_password.min_length` on the instance; the server re-checks. */
export const MIN_PASSWORD_LENGTH = 15;

/** The email-code step is six digits on this instance. */
export const CODE_LENGTH = 6;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Identifier codes that mean "wrong door": send the person to the other screen. */
export const IDENTIFIER_NOT_FOUND = 'form_identifier_not_found';
export const IDENTIFIER_EXISTS = 'form_identifier_exists';
