import { Exercise } from "@/domain/entities/exercise/Exercise";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";

import { exerciseDTOProperties } from "../../../../../tests/dtoProperties/exerciseDtoProperties";
import {
  USER_ONE_ID,
  USER_TWO_ID,
  createSeedExercisesNoPersistence,
  getCommonExercises,
  getExercisesForUser,
} from "../../../../../tests/seeds/createSeedExercisesNoPersistence";
import { GetExercisesByFuzzyNameUsecase } from "../GetExercisesByFuzzyNameUsecase";

describe("GetExercisesByFuzzyNameUsecase", () => {
  let exerciseRepo: MemoryExercisesRepo;
  let usecase: GetExercisesByFuzzyNameUsecase;
  let exercises: Exercise[];

  beforeEach(async () => {
    exerciseRepo = new MemoryExercisesRepo();

    usecase = new GetExercisesByFuzzyNameUsecase(exerciseRepo);

    exercises = createSeedExercisesNoPersistence();

    exercises.forEach(async (exercise) => {
      await exerciseRepo.save(exercise);
    });
  });

  describe("Execution", () => {
    it("should return array of ExerciseDTO", async () => {
      const userOneExercises = getExercisesForUser(USER_ONE_ID);

      const result = await usecase.execute({
        name: userOneExercises[0].name,
        userId: userOneExercises[0].userId!,
      });

      result.forEach((exerciseDTO) => {
        expect(exerciseDTO).not.toBeInstanceOf(Exercise);

        for (const prop of exerciseDTOProperties) {
          expect(exerciseDTO).toHaveProperty(prop);
        }
      });
    });

    it("should return user exercises first, then common exercises", async () => {
      const userOneExercises = getExercisesForUser(USER_ONE_ID);
      const commonExercises = getCommonExercises();

      const result = await usecase.execute({
        name: "Exercise",
        userId: USER_ONE_ID,
      });

      const resultIds = result.map((exercise) => exercise.id);

      const expectedOrder = [
        ...userOneExercises.map((exercise) => exercise.id),
        ...commonExercises.map((exercise) => exercise.id),
      ];

      expect(resultIds).toEqual(expectedOrder);
    });

    it("should return an empty array if no exercises match", async () => {
      const result = await usecase.execute({
        name: "Non-existent Exercise",
        userId: USER_ONE_ID,
      });

      expect(result).toEqual([]);
    });

    it("should not return another user's exercises", async () => {
      const userTwoExercises = getExercisesForUser(USER_TWO_ID);

      const result = await usecase.execute({
        name: "Exercise",
        userId: USER_ONE_ID,
      });

      const resultIds = result.map((exercise) => exercise.id);

      userTwoExercises.forEach((exercise) => {
        expect(resultIds).not.toContain(exercise.id);
      });
    });

    it("can paginate results", async () => {
      const result = await usecase.execute({
        name: "Exercise",
        userId: USER_ONE_ID,
        page: 1,
        limit: 2,
      });

      expect(result.length).toBe(2);
    });
  });
});
