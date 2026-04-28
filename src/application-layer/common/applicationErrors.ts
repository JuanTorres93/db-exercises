import { DomainError } from "@/domain/common/domainErrors";

export class ApplicationError extends Error {}

export function isApplicationError(err: Error) {
  return err instanceof ApplicationError;
}
export class NotFoundApplicationError extends DomainError {}

export class AlreadyExistsApplicationError extends DomainError {}
