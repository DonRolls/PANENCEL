export type AuthResult =
  | { ok: true; message?: string }
  | { ok: false; message: string };
