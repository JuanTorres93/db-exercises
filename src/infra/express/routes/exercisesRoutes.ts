import express from "express";

import {
  createNewExercise,
  getExercisesByFuzzyName,
  renameExercise,
} from "../controllers/exercisesController";

const router = express.Router();

router.post("/", createNewExercise);

router.get("/:fuzzyName", getExercisesByFuzzyName);

router.put("/:exerciseId", renameExercise);

export default router;
