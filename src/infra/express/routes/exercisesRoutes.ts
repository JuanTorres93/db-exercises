import express from "express";

import { createNewExercise } from "../controllers/exercisesController";

const router = express.Router();

router.post("/", createNewExercise);

export default router;
