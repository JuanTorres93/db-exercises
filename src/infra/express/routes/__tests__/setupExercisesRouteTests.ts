import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { AppExercisesRepo } from "@/interface-adapters/repos/AppExercisesRepo";

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
