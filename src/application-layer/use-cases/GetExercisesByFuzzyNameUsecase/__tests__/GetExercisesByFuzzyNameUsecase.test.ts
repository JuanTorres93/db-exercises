import { Exercise } from "@/domain/entities/exercise/Exercise";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";

import { createTestExercise } from "../../../../../tests/createProps/exerciseTestProps";
import { exerciseDTOProperties } from "../../../../../tests/dtoProperties/exerciseDtoProperties";
import { GetExercisesByFuzzyNameUsecase } from "../GetExercisesByFuzzyNameUsecase";

const USER_ONE_ID = "user-1";
const USER_TWO_ID = "user-2";

describe("GetExercisesByFuzzyNameUsecase", () => {
  let exerciseRepo: MemoryExercisesRepo;
  let usecase: GetExercisesByFuzzyNameUsecase;
  let exercises: Exercise[];

  beforeEach(async () => {
    exerciseRepo = new MemoryExercisesRepo();

    usecase = new GetExercisesByFuzzyNameUsecase(exerciseRepo);

    exercises = createSeedExercises();

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
  });
});

function getExercisesForUser(userId: string) {
  return createSeedExercises().filter((exercise) => exercise.userId === userId);
}

function getCommonExercises() {
  return createSeedExercises().filter((exercise) => !exercise.userId);
}

function createSeedExercises() {
  return [
    createTestExercise({
      id: "ex1",
      name: "Test Exercise",
      userId: USER_ONE_ID,
    }),
    createTestExercise({
      id: "ex2",
      name: "Another Exercise",
      userId: USER_ONE_ID,
    }),
    createTestExercise({
      id: "ex3",
      name: "Yet Another Exercise",
      userId: USER_ONE_ID,
    }),

    createTestExercise({
      id: "ex4",
      name: "Some Exercise",
      userId: USER_TWO_ID,
    }),
    createTestExercise({
      id: "ex5",
      name: "Some Other Exercise",
      userId: USER_TWO_ID,
    }),

    createTestExercise({
      id: "ex6",
      name: "Different Exercise",
    }),
    createTestExercise({
      id: "ex7",
      name: "Unique Exercise",
    }),
    createTestExercise({
      id: "ex8",
      name: "Special Exercise",
    }),
    createTestExercise({
      id: "ex9",
      name: "Common Exercise",
    }),
    createTestExercise({
      id: "ex10",
      name: "Final Exercise",
    }),
  ];
}
