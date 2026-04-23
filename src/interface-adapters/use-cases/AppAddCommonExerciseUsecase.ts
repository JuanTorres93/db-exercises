import { AddCommonExerciseUsecase } from "@/application-layer/use-cases/AddCommonExerciseUsecase/AddCommonExerciseUsecase";

import { AppExercisesRepo } from "../repos/AppExercisesRepo";
import { AppIdGenerator } from "../services/AppIdGenerator";

export const AppAddCommonExerciseUsecase = new AddCommonExerciseUsecase(
  AppExercisesRepo,
  AppIdGenerator,
);
