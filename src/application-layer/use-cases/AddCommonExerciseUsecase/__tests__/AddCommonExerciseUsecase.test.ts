import { AlreadyExistsApplicationError } from "@/application-layer/common/applicationErrors";
import { Exercise } from "@/domain/entities/exercise/Exercise";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { CryptoUUIDIdGenerator } from "@/infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator";

import { createTestExercise } from "../../../../../tests/createProps/exerciseTestProps";
import { exerciseDTOProperties } from "../../../../../tests/dtoProperties/exerciseDtoProperties";
import { AddCommonExerciseUsecase } from "../AddCommonExerciseUsecase";

describe("AddCommonExerciseUsecase", () => {
  let exercisesRepo: MemoryExercisesRepo;
  let idGenerator: CryptoUUIDIdGenerator;

  let usecase: AddCommonExerciseUsecase;
  let exercise: Exercise;

  beforeEach(async () => {
    exercisesRepo = new MemoryExercisesRepo();
    idGenerator = new CryptoUUIDIdGenerator();

    usecase = new AddCommonExerciseUsecase(exercisesRepo, idGenerator);

    exercise = createTestExercise({
      userId: "a-user-id",
    });
  });

  describe("Execution", () => {
    it("should return ExerciseDTO", async () => {
      const exerciseDTO = await usecase.execute({
        name: exercise.name,
      });

      expect(exerciseDTO).not.toBeInstanceOf(Exercise);
      for (const prop of exerciseDTOProperties) {
        expect(exerciseDTO).toHaveProperty(prop);
      }
    });

    it("should generate different ids for different exercises", async () => {
      const exerciseDTO = await usecase.execute({
        name: "One exercise name",
      });

      const anotherExerciseDTO = await usecase.execute({
        name: "Another exercise name",
      });

      expect(exerciseDTO.id).not.toBe(anotherExerciseDTO.id);
    });
  });

  describe("Side effects", () => {
    it("should persist new exercise in the repository", async () => {
      const exerciseDTO = await usecase.execute({
        name: exercise.name,
      });

      const foundExercise = await exercisesRepo.getById(exerciseDTO.id);

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
      ).rejects.toThrow(AlreadyExistsApplicationError);

      await expect(
        usecase.execute({
          name: exercise.name,
        }),
      ).rejects.toThrow("An exercise with the same name already exists");
    });
  });
});
