import { Exercise } from "@/domain/entities/exercise/Exercise";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { AppExercisesRepo } from "@/interface-adapters/repos/AppExercisesRepo";

import { USER_ONE_ID } from "../../../../../tests/seeds/createSeedExercisesNoPersistence";
import { createExercisesInRepoAndCleanAfterEach } from "../../__tests__/createExercisesInRepoAndCleanAfterEach";

export function setupExercisesRouteTests() {
  beforeEach(async () => {
    await createExercisesInRepoAndCleanAfterEach();

    if (!(AppExercisesRepo instanceof MemoryExercisesRepo))
      throw new Error(
        "AppExercisesRepo must be an instance of MemoryExercisesRepo",
      );
  });
}

export async function getExistingExercise(): Promise<Exercise> {
  const existingExercise = (await AppExercisesRepo.getByUserId(USER_ONE_ID))[0];

  return existingExercise;
}
