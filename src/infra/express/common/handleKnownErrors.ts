import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import {
  AlreadyExistsApplicationError,
  ApplicationError,
  NotFoundApplicationError,
  PermissionApplicationError,
  ValidationApplicationError,
  isApplicationError,
} from "@/application-layer/common/applicationErrors";
import { ValidationDomainError } from "@/domain/common/domainErrors";

import { JSENDFailure } from "./JSEND";

function getStatusForApplicationError(err: ApplicationError): number {
  if (err instanceof AlreadyExistsApplicationError) return 409;
  if (err instanceof NotFoundApplicationError) return 404;
  if (err instanceof PermissionApplicationError) return 409;
  if (err instanceof ValidationApplicationError) return 400;

  return 500;
}

export const handleKnownErrors: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jsend: JSENDFailure = {
    status: "fail",
    data: {},
  };

  if (isApplicationError(err)) {
    jsend.data = {
      [err.field]: err.message,
    };

    return res.status(getStatusForApplicationError(err)).json(jsend);
  }

  if (err instanceof ValidationDomainError) {
    jsend.data = { validation: err.message };

    return res.status(400).json(jsend);
  }

  next(err);
};
