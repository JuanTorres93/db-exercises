import cors from "cors";
import express from "express";
import morgan from "morgan";

// import coffeesRouter from './routes/coffeesRoutes';

const app = express();
app.use(express.json());

app.use(cors());

if (process.env.NODE_ENV !== "test") app.use(morgan("short"));

// app.use('/coffees', coffeesRouter);

export default app;
