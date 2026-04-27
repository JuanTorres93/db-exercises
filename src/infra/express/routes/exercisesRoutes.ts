import express from "express";

import {
  createNewExercise,
  deleteExercise,
  getExercisesByFuzzyName,
  renameExercise,
} from "../controllers/exercisesController";

const router = express.Router();

// TODO Create middleware to validate the request body and return appropriate JSEND fail response if the body is invalid
router.post("/", createNewExercise);

router.get("/:fuzzyName", getExercisesByFuzzyName);

router.delete("/:exerciseId", deleteExercise);

router.put("/:exerciseId", renameExercise);

export default router;
