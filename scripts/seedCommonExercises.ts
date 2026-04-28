import mongoose from "mongoose";

import { AlreadyExistsApplicationError } from "@/application-layer/common/applicationErrors";
import { AppAddCommonExerciseUsecase } from "@/interface-adapters/use-cases/AppAddCommonExerciseUsecase";

const exerciseNames = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Pull-Up",
  "Dip",
  "Bicep Curl",
  "Tricep Pushdown",
  "Leg Press",
];

for (const name of exerciseNames) {
  try {
    const exercise = await AppAddCommonExerciseUsecase.execute({ name });
    console.log(`✓ Added: ${exercise.name}`);
  } catch (error) {
    if (error instanceof AlreadyExistsApplicationError) {
      console.log(`— Skipped (already exists): ${name}`);
    } else {
      throw error;
    }
  }
}

await mongoose.disconnect();
console.log("Done.");
