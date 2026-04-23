import { AddExerciseForUserUsecase } from "@/application-layer/use-cases/AddExerciseForUserUsecase/AddExerciseForUserUsecase";

import { AppExercisesRepo } from "../repos/AppExercisesRepo";
import { AppIdGenerator } from "../services/AppIdGenerator";

export const AppAddExerciseForUserUsecase = new AddExerciseForUserUsecase(
  AppExercisesRepo,
  AppIdGenerator,
);
