import { AlreadyExistsApplicationError } from "@/application-layer/common/applicationErrors";
import { ValidationError } from "@/domain/common/domainErrors";
import { Exercise } from "@/domain/entities/exercise/Exercise";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { CryptoUUIDIdGenerator } from "@/infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator";

import { createTestExercise } from "../../../../../tests/createProps/exerciseTestProps";
import { exerciseDTOProperties } from "../../../../../tests/dtoProperties/exerciseDtoProperties";
import { AddExerciseForUserUsecase } from "../AddExerciseForUserUsecase";

describe("AddExerciseForUserUsecase", () => {
  let exercisesRepo: MemoryExercisesRepo;
  let idGenerator: CryptoUUIDIdGenerator;

  let usecase: AddExerciseForUserUsecase;
  let exercise: Exercise;

  beforeEach(async () => {
    exercisesRepo = new MemoryExercisesRepo();
    idGenerator = new CryptoUUIDIdGenerator();

    usecase = new AddExerciseForUserUsecase(exercisesRepo, idGenerator);

    exercise = createTestExercise({
      userId: "user-1",
    });
  });

  describe("Execution", () => {
    it("should return ExerciseDTO", async () => {
      const result = await usecase.execute({
        name: exercise.name,
        userId: exercise.userId!,
      });

      expect(result).not.toBeInstanceOf(Exercise);
      for (const prop of exerciseDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it("should generate different ids for different exercises", async () => {
      const otherExerciseDTO = await usecase.execute({
        name: "Another Exercise",
        userId: exercise.userId!,
      });

      const anotherExerciseDTO = await usecase.execute({
        name: "Yet Another Exercise",
        userId: exercise.userId!,
      });

      expect(otherExerciseDTO.id).not.toBe(exercise.id);
      expect(anotherExerciseDTO.id).not.toBe(exercise.id);
      expect(anotherExerciseDTO.id).not.toBe(otherExerciseDTO.id);
    });
  });

  describe("Side effects", () => {
    it("should persist exercise in repo", async () => {
      const exerciseDTO = await usecase.execute({
        name: exercise.name,
        userId: exercise.userId!,
      });

      const foundExercise = await exercisesRepo.getById(exerciseDTO.id);

      expect(foundExercise).toBeInstanceOf(Exercise);
      expect(foundExercise!.id).toBe(exerciseDTO.id);
      expect(foundExercise!.name).toBe(exerciseDTO.name);
      expect(foundExercise!.userId).toBe(exerciseDTO.userId);
    });
  });

  describe("Errors", () => {
    it("should throw error if userId is not provided", async () => {
      await expect(() =>
        usecase.execute({
          name: exercise.name,
          userId: "",
        }),
      ).rejects.toThrow(ValidationError);

      await expect(() =>
        usecase.execute({
          name: exercise.name,
          userId: "",
        }),
      ).rejects.toThrow(/AddExerciseForUserUsecase.*ID is required/);
    });

    it("should throw error if name already exists for user id", async () => {
      const name = "Exercise Name";
      const userId = "user-1";

      await usecase.execute({
        name,
        userId,
      });

      await expect(() =>
        usecase.execute({
          name,
          userId,
        }),
      ).rejects.toThrow(AlreadyExistsApplicationError);
      await expect(() =>
        usecase.execute({
          name,
          userId,
        }),
      ).rejects.toThrow(/AddExerciseForUserUsecase.*already exists/);
    });
  });
});
