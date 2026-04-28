export class ApplicationError extends Error {}

export function isApplicationError(err: Error) {
  return err instanceof ApplicationError;
}
