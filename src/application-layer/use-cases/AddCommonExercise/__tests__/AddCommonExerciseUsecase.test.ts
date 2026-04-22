import { AlreadyExistsError } from "@/domain/common/errors";
import { Exercise } from "@/domain/entities/exercise/Exercise";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { Uuidv4IdGenerator } from "@/infra/services/Uuidv4IdGenerator/Uuidv4IdGenerator";

import { createTestExercise } from "../../../../../tests/createProps/exerciseTestProps";
import { exerciseDTOProperties } from "../../../../../tests/dtoProperties/exerciseDtoProperties";
import { AddCommonExerciseUsecase } from "../AddCommonExerciseUsecase";

describe("AddCommonExerciseUsecase", () => {
  let exercisesRepo: MemoryExercisesRepo;
  let idGenerator: Uuidv4IdGenerator;

  let usecase: AddCommonExerciseUsecase;
  let exercise: Exercise;

  beforeEach(async () => {
    exercisesRepo = new MemoryExercisesRepo();
    idGenerator = new Uuidv4IdGenerator();

    usecase = new AddCommonExerciseUsecase(exercisesRepo, idGenerator);

    exercise = createTestExercise({
      userId: "a-user-id",
    });
  });

  describe("Execution", () => {
    it("should return ExerciseDTO", async () => {
      const result = await usecase.execute({
        name: exercise.name,
      });

      expect(result).not.toBeInstanceOf(Exercise);
      for (const prop of exerciseDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it("should generate different ids for different exercises", async () => {
      const result1 = await usecase.execute({
        name: "One exercise name",
      });

      const result2 = await usecase.execute({
        name: "Another exercise name",
      });

      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe("Side effects", () => {
    it("should persist new exercise in the repository", async () => {
      const result = await usecase.execute({
        name: exercise.name,
      });

      const foundExercise = await exercisesRepo.getById(result.id);

      expect(foundExercise).not.toBeNull();
      expect(foundExercise!.name).toBe(exercise.name);
      expect(foundExercise!.userId).toBeUndefined();
    });
  });

  describe("Errors", () => {
    it("should throw error if name already exists", async () => {
      // Create common exercise first
      await usecase.execute({
        name: exercise.name,
      });

      // Test for error
      await expect(
        usecase.execute({
          name: exercise.name,
        }),
      ).rejects.toThrow(AlreadyExistsError);

      await expect(
        usecase.execute({
          name: exercise.name,
        }),
      ).rejects.toThrow(
        /AddCommonExerciseUsecase: Exercise with name.*already exists/,
      );
    });
  });
});
