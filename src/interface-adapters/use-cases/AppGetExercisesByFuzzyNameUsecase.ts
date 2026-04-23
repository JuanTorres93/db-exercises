import { GetExercisesByFuzzyNameUsecase } from "@/application-layer/use-cases/GetExercisesByFuzzyNameUsecase/GetExercisesByFuzzyNameUsecase";

import { AppExercisesRepo } from "../repos/AppExercisesRepo";

export const AppGetExercisesByFuzzyNameUsecase =
  new GetExercisesByFuzzyNameUsecase(AppExercisesRepo);
