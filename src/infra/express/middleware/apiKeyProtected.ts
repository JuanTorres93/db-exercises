import { NextFunction, Request, Response } from "express";

export function apiKeyProtected(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "Missing API key" });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
}
