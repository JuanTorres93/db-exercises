import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import { JSENDError } from "./JSEND";

export const handleUnhandledErrors: ErrorRequestHandler = (
  err: ErrorRequestHandler,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Unhandled error:", err);

  const jsend: JSENDError = {
    status: "error",
    message: "Something went wrong",
  };

  res.status(500).json(jsend);
};
