import { RenameExerciseForUserIdUsecase } from "@/application-layer/use-cases/RenameExerciseForUserIdUsecase/RenameExerciseForUserIdUsecase";

import { AppExercisesRepo } from "../repos/AppExercisesRepo";

export const AppRenameExerciseForUserIdUsecase =
  new RenameExerciseForUserIdUsecase(AppExercisesRepo);
