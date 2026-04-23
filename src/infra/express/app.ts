import cors from "cors";
import express from "express";
import morgan from "morgan";

import exercisesRouter from "./routes/exercisesRoutes";

const app = express();
app.use(express.json());

app.use(cors());

if (process.env.NODE_ENV !== "test") app.use(morgan("short"));

app.use("/exercises", exercisesRouter);

export default app;
