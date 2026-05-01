import { AddExerciseForUserUsecaseRequest } from "@/application-layer/use-cases/AddExerciseForUserUsecase/AddExerciseForUserUsecase";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { AppExercisesRepo } from "@/interface-adapters/repos/AppExercisesRepo";
import { AppAddCommonExerciseUsecase } from "@/interface-adapters/use-cases/AppAddCommonExerciseUsecase";
import { AppAddExerciseForUserUsecase } from "@/interface-adapters/use-cases/AppAddExerciseForUserUsecase";

import {
  USER_ONE_ID,
  USER_TWO_ID,
  getCommonExercises,
  getExercisesForUser,
} from "../../../../tests/seeds/createSeedExercisesNoPersistence";

export async function createExercisesInRepoAndCleanAfterEach() {
  throwIfNotMemoryRepo(AppExercisesRepo);

  AppExercisesRepo.clearForTesting();

  const commonExercises = getCommonExercises();
  const exercisesForUserOne = getExercisesForUser(USER_ONE_ID);
  const exercisesForUserTwo = getExercisesForUser(USER_TWO_ID);

  await Promise.all([
    ...commonExercises.map((exerciseData) =>
      AppAddCommonExerciseUsecase.execute(exerciseData.toCreateProps()),
    ),
    ...exercisesForUserOne.map((exerciseData) =>
      AppAddExerciseForUserUsecase.execute(
        exerciseData.toCreateProps() as AddExerciseForUserUsecaseRequest,
      ),
    ),
    ...exercisesForUserTwo.map((exerciseData) =>
      AppAddExerciseForUserUsecase.execute(
        exerciseData.toCreateProps() as AddExerciseForUserUsecaseRequest,
      ),
    ),
  ]);

  afterEach(() => {
    throwIfNotMemoryRepo(AppExercisesRepo);

    AppExercisesRepo.clearForTesting();
  });
}

export function throwIfNotMemoryRepo(
  repo: unknown,
): asserts repo is MemoryExercisesRepo {
  if (!(repo instanceof MemoryExercisesRepo)) {
    throw new Error("Expected repo to be an instance of MemoryExercisesRepo");
  }
}
