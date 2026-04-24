import express from "express";

import {
  createNewExercise,
  renameExercise,
} from "../controllers/exercisesController";

const router = express.Router();

router.post("/", createNewExercise);

router.put("/:exerciseId", renameExercise);

export default router;
