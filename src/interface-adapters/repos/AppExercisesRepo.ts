import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { MongooseExercisesRepo } from "@/infra/repos/mongoose/MongooseExercisesRepo";

import { mongooseInitPromise } from "./common/initMongoose";

let AppExercisesRepo: MemoryExercisesRepo | MongooseExercisesRepo;

if (process.env.NODE_ENV === "test") {
  AppExercisesRepo = new MemoryExercisesRepo();
} else if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "production"
) {
  // Wait for the joint promise of MongoDB connection
  await mongooseInitPromise;

  AppExercisesRepo = new MongooseExercisesRepo();
} else {
  throw new Error(
    "AppRecipesRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}
export { AppExercisesRepo };
