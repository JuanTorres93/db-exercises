import cors from "cors";
import express from "express";
import morgan from "morgan";

import { handleKnownErrors } from "./common/handleKnownErrors";
import { handleUnhandledErrors } from "./common/handleUnhandledErrors";
import exercisesRouter from "./routes/exercisesRoutes";

const app = express();
app.use(express.json());

app.use(cors());

if (process.env.NODE_ENV !== "test") app.use(morgan("short"));

app.use("/exercises", exercisesRouter);

// IMPORTANT NOTE: These should be the last middlewares in the chain, after all routes and other middlewares have been defined.
app.use(handleKnownErrors);
app.use(handleUnhandledErrors);

export default app;
