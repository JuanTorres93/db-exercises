export class ApplicationError extends Error {}

export function isApplicationError(err: Error) {
  return err instanceof ApplicationError;
}

export class ValidationApplicationError extends ApplicationError {}

export class NotFoundApplicationError extends ApplicationError {}

export class AlreadyExistsApplicationError extends ApplicationError {}

export class PermissionApplicationError extends ApplicationError {}
