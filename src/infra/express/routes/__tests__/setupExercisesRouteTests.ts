import { Exercise } from "@/domain/entities/exercise/Exercise";
import { AppExercisesRepo } from "@/interface-adapters/repos/AppExercisesRepo";

import { USER_ONE_ID } from "../../../../../tests/seeds/createSeedExercisesNoPersistence";
import { createExercisesInRepoAndCleanAfterEach } from "../../__tests__/createExercisesInRepoAndCleanAfterEach";

export function setupExercisesRouteTests() {
  beforeEach(async () => {
    await createExercisesInRepoAndCleanAfterEach();
  });
}

export async function getExistingExercise(): Promise<Exercise> {
  const existingExercise = (await AppExercisesRepo.getByUserId(USER_ONE_ID))[0];

  return existingExercise;
}
