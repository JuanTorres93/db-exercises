export class DomainError extends Error {}

export function isDomainError(err: Error) {
  return err instanceof DomainError;
}

export class ValidationDomainError extends DomainError {}
