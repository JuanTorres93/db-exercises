import { AlreadyExistsError } from "@/domain/common/errors";
import { Exercise } from "@/domain/entities/exercise/Exercise";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { Uuidv4IdGenerator } from "@/infra/services/Uuidv4IdGenerator/Uuidv4IdGenerator";

import { createTestExercise } from "../../../../../tests/createProps/exerciseTestProps";
import { exerciseDTOProperties } from "../../../../../tests/dtoProperties/exerciseDtoProperties";
import { AddExerciseUsecase } from "../AddExerciseUsecase";

describe("AddExerciseUsecase", () => {
  let exercisesRepo: MemoryExercisesRepo;
  let idGenerator: Uuidv4IdGenerator;

  let usecase: AddExerciseUsecase;
  let exercise: Exercise;

  beforeEach(async () => {
    exercisesRepo = new MemoryExercisesRepo();
    idGenerator = new Uuidv4IdGenerator();

    usecase = new AddExerciseUsecase(exercisesRepo, idGenerator);

    exercise = createTestExercise({
      userId: "a-user-id",
    });
  });

  describe("Execution", () => {
    it("should return ExerciseDTO", async () => {
      const result = await usecase.execute({
        name: exercise.name,
        userId: exercise.userId,
      });

      expect(result).not.toBeInstanceOf(Exercise);
      for (const prop of exerciseDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it("should generate different ids for different exercises", async () => {
      const result1 = await usecase.execute({
        name: "One exercise name",
        userId: exercise.userId,
      });

      const result2 = await usecase.execute({
        name: "Another exercise name",
        userId: exercise.userId,
      });

      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe("Side effects", () => {
    it("should persist new exercise in the repository", async () => {
      const result = await usecase.execute({
        name: exercise.name,
        userId: exercise.userId,
      });

      const foundExercise = await exercisesRepo.getById(result.id);

      expect(foundExercise).not.toBeNull();
      expect(foundExercise!.name).toBe(exercise.name);
      expect(foundExercise!.userId).toBe(exercise.userId);
    });
  });

  describe("Errors", () => {
    it("should throw error if name already exists for userId", async () => {
      const userId = "another-user-id";

      // Create exercise first
      await usecase.execute({
        name: exercise.name,
        userId,
      });

      // Test for error
      await expect(
        usecase.execute({
          name: exercise.name,
          userId,
        }),
      ).rejects.toThrow(AlreadyExistsError);

      await expect(
        usecase.execute({
          name: exercise.name,
          userId,
        }),
      ).rejects.toThrow(
        /AddExerciseUsecase: Exercise with name ".*" already exists for userId ".*"./,
      );
    });

    it("should throw error if name already exists for common exercises (no user-id)", async () => {
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
        /AddExerciseUsecase: Exercise with name ".*" already exists for userId "undefined"./,
      );
    });
  });
});
