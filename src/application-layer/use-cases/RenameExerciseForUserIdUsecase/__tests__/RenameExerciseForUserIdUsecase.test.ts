import { NotFoundApplicationError } from "@/application-layer/common/applicationErrors";
import { AlreadyExistsApplicationError } from "@/application-layer/common/applicationErrors";
import { PermissionApplicationError } from "@/application-layer/common/applicationErrors";
import { Exercise } from "@/domain/entities/exercise/Exercise";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";

import { createTestExercise } from "../../../../../tests/createProps/exerciseTestProps";
import { exerciseDTOProperties } from "../../../../../tests/dtoProperties/exerciseDtoProperties";
import { RenameExerciseForUserIdUsecase } from "../RenameExerciseForUserIdUsecase";

describe("RenameExerciseForUserIdUsecase", () => {
  let exercisesRepo: MemoryExercisesRepo;
  let usecase: RenameExerciseForUserIdUsecase;
  let exercise: Exercise;

  beforeEach(async () => {
    exercisesRepo = new MemoryExercisesRepo();

    usecase = new RenameExerciseForUserIdUsecase(exercisesRepo);

    exercise = createTestExercise({ userId: "user-1" });

    await exercisesRepo.save(exercise);
  });

  describe("Execution", () => {
    it("should return ExerciseDTO", async () => {
      const exerciseDTO = await usecase.execute({
        exerciseId: exercise.id,
        userId: exercise.userId!,
        newName: "New Name",
      });

      expect(exerciseDTO).not.toBeInstanceOf(Exercise);
      for (const prop of exerciseDTOProperties) {
        expect(exerciseDTO).toHaveProperty(prop);
      }
    });

    it("should return DTO with the new name", async () => {
      const newName = "Renamed Exercise";

      const exerciseDTO = await usecase.execute({
        exerciseId: exercise.id,
        userId: exercise.userId!,
        newName,
      });

      expect(exerciseDTO.name).toBe(newName);
    });
  });

  describe("Side effects", () => {
    it("should persist the new name in repo", async () => {
      const newName = "Renamed Exercise";

      await usecase.execute({
        exerciseId: exercise.id,
        userId: exercise.userId!,
        newName,
      });

      const foundExercise = await exercisesRepo.getById(exercise.id);
      expect(foundExercise!.name).toBe(newName);
    });
  });

  describe("Errors", () => {
    it("should throw NotFoundError if exercise does not exist", async () => {
      await expect(() =>
        usecase.execute({
          exerciseId: "non-existent-id",
          userId: exercise.userId!,
          newName: "New Name",
        }),
      ).rejects.toThrow(NotFoundApplicationError);

      await expect(() =>
        usecase.execute({
          exerciseId: "non-existent-id",
          userId: exercise.userId!,
          newName: "New Name",
        }),
      ).rejects.toThrow(/RenameExerciseForUserIdUsecase.*not found/);
    });

    it("should throw PermissionError if exercise does not belong to user", async () => {
      await expect(() =>
        usecase.execute({
          exerciseId: exercise.id,
          userId: "other-user",
          newName: "New Name",
        }),
      ).rejects.toThrow(PermissionApplicationError);

      await expect(() =>
        usecase.execute({
          exerciseId: exercise.id,
          userId: "other-user",
          newName: "New Name",
        }),
      ).rejects.toThrow(/RenameExerciseForUserIdUsecase.*does not belong/);
    });

    it("should throw AlreadyExistsError if new name already exists for user", async () => {
      const otherExercise = createTestExercise({
        id: "ex-2",
        name: "Other Exercise",
        userId: exercise.userId,
      });
      await exercisesRepo.save(otherExercise);

      await expect(() =>
        usecase.execute({
          exerciseId: exercise.id,
          userId: exercise.userId!,
          newName: otherExercise.name,
        }),
      ).rejects.toThrow(AlreadyExistsApplicationError);

      await expect(() =>
        usecase.execute({
          exerciseId: exercise.id,
          userId: exercise.userId!,
          newName: otherExercise.name,
        }),
      ).rejects.toThrow(/RenameExerciseForUserIdUsecase.*already exists/);
    });
  });
});
