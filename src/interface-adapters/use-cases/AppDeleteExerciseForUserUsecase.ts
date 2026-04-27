import { DeleteExerciseForUserUsecase } from "@/application-layer/use-cases/DeleteExerciseForUserUsecase/DeleteExerciseForUserUsecase";

import { AppExercisesRepo } from "../repos/AppExercisesRepo";

export const AppDeleteExerciseForUserUsecase = new DeleteExerciseForUserUsecase(
  AppExercisesRepo,
);
