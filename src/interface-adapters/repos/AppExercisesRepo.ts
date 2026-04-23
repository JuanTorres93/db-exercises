import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";

// TODO IMPORTANT: Add mongoose repo for dev and prod
export const AppExercisesRepo = new MemoryExercisesRepo();
