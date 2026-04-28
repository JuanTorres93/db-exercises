import express from "express";

import {
  createNewExercise,
  deleteExercise,
  getExercisesByFuzzyName,
  renameExercise,
} from "../controllers/exercisesController";

const router = express.Router();

router.post("/", createNewExercise);

router.get("/:fuzzyName", getExercisesByFuzzyName);

router.delete("/:exerciseId", deleteExercise);

router.put("/:exerciseId", renameExercise);

export default router;
