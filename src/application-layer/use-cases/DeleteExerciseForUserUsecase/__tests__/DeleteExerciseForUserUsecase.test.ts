import { NotFoundError, PermissionError } from "@/domain/common/domainErrors";
import { Exercise } from "@/domain/entities/exercise/Exercise";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";

import { createTestExercise } from "../../../../../tests/createProps/exerciseTestProps";
import { exerciseDTOProperties } from "../../../../../tests/dtoProperties/exerciseDtoProperties";
import { DeleteExerciseForUserUsecase } from "../DeleteExerciseForUserUsecase";

describe("DeleteExerciseForUserUsecase", () => {
  let exercisesRepo: MemoryExercisesRepo;
  let usecase: DeleteExerciseForUserUsecase;
  let exercise: Exercise;

  beforeEach(async () => {
    exercisesRepo = new MemoryExercisesRepo();
    usecase = new DeleteExerciseForUserUsecase(exercisesRepo);

    exercise = createTestExercise({ userId: "user-1" });
    await exercisesRepo.save(exercise);
  });

  describe("Execution", () => {
    it("should return ExerciseDTO", async () => {
      const exerciseDTO = await usecase.execute({
        exerciseId: exercise.id,
        userId: exercise.userId!,
      });

      expect(exerciseDTO).not.toBeInstanceOf(Exercise);
      for (const prop of exerciseDTOProperties) {
        expect(exerciseDTO).toHaveProperty(prop);
      }
    });

    it("should return DTO of the deleted exercise", async () => {
      const exerciseDTO = await usecase.execute({
        exerciseId: exercise.id,
        userId: exercise.userId!,
      });

      expect(exerciseDTO.id).toBe(exercise.id);
      expect(exerciseDTO.name).toBe(exercise.name);
    });
  });

  describe("Side effects", () => {
    it("should remove the exercise from the repo", async () => {
      await usecase.execute({
        exerciseId: exercise.id,
        userId: exercise.userId!,
      });

      const found = await exercisesRepo.getById(exercise.id);
      expect(found).toBeNull();
    });
  });

  describe("Errors", () => {
    it("should throw NotFoundError if exercise does not exist", async () => {
      await expect(() =>
        usecase.execute({
          exerciseId: "non-existent-id",
          userId: exercise.userId!,
        }),
      ).rejects.toThrow(NotFoundError);

      await expect(() =>
        usecase.execute({
          exerciseId: "non-existent-id",
          userId: exercise.userId!,
        }),
      ).rejects.toThrow(/DeleteExerciseForUserUsecase.*not found/);
    });

    it("should throw NotFoundError if exercise does not belong to user", async () => {
      await expect(() =>
        usecase.execute({
          exerciseId: exercise.id,
          userId: "other-user",
        }),
      ).rejects.toThrow(NotFoundError);

      await expect(() =>
        usecase.execute({
          exerciseId: "non-existent-id",
          userId: exercise.userId!,
        }),
      ).rejects.toThrow(/DeleteExerciseForUserUsecase.*not found/);
    });
  });
});
