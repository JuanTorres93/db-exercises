import { Exercise } from "@/domain/entities/exercise/Exercise";

import { createTestExercise } from "../../../../../tests/createProps/exerciseTestProps";
import { MemoryExercisesRepo } from "../MemoryExercisesRepo";

describe("MemoryExercisesRepo", () => {
  let repo: MemoryExercisesRepo;
  let exercise: Exercise;

  beforeEach(async () => {
    exercise = createTestExercise();

    repo = new MemoryExercisesRepo();

    await repo.save(exercise);
  });

  describe("getById", () => {
    it("returns the exercise when it exists", async () => {
      const foundExercise = await repo.getById(exercise.id);

      expect(foundExercise).toBeInstanceOf(Exercise);
      expect(foundExercise!.id).toBe(exercise.id);
    });

    it("should return null when exercise does not exist", async () => {
      const foundExercise = await repo.getById("non-existent-id");

      expect(foundExercise).toBeNull();
    });
  });

  describe("getByUserId", () => {
    it("returns exercises that belong to a user", async () => {
      const otherExercise = Exercise.create({
        id: "other-exercise-id",
        name: "Ex 2",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-1",
      });
      const anotherDifferentExercise = Exercise.create({
        id: "ex3",
        name: "Ex 3",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-2",
      });

      await repo.save(otherExercise);
      await repo.save(anotherDifferentExercise);

      const user1Exercises = await repo.getByUserId("user-1");

      expect(user1Exercises.map((exercise) => exercise.id)).toEqual([
        "other-exercise-id",
      ]);
    });

    it("returns an empty array when no exercises match", async () => {
      const exercises = await repo.getByUserId("non-existent-user");

      expect(exercises).toEqual([]);
    });
  });

  describe("getByFuzzyName", () => {
    it("returns exercises matching a fuzzy name (case-insensitive)", async () => {
      const otherExercise = createTestExercise({
        id: "other-exercise-id",
        name: "Push Up",
      });
      const anotherDifferentExercise = createTestExercise({
        id: "ex3",
        name: "Pull Down",
      });

      await repo.save(otherExercise);
      await repo.save(anotherDifferentExercise);

      const foundExercises = await repo.getByFuzzyName("push");

      expect(foundExercises.map((exercise) => exercise.id)).toEqual([
        "other-exercise-id",
      ]);
    });
  });

  describe("getByNameAndUserId", () => {
    it("returns the exercise matching name and userId (case-insensitive)", async () => {
      const otherExercise = Exercise.create({
        id: "other-exercise-id",
        name: "My Exercise",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-1",
      });

      await repo.save(otherExercise);

      const found = await repo.getByNameAndUserId("my exercise", "user-1");

      expect(found!.id).toBe("other-exercise-id");
    });

    it("should return null when no exercise is found", async () => {
      const foundExercise = await repo.getByNameAndUserId(
        "non-existent-name",
        "user-1",
      );

      expect(foundExercise).toBeNull();
    });

    it("should return common exercises if userId is not provided", async () => {
      const commonExercise = Exercise.create({
        id: "common-exercise-id",
        name: "Common Exercise",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await repo.save(commonExercise);

      const foundExercise = await repo.getByNameAndUserId("common exercise");

      expect(foundExercise!.id).toBe("common-exercise-id");
    });
  });

  describe("save", () => {
    it("persists a new exercise and can be retrieved", async () => {
      const otherExercise = createTestExercise({
        id: "other-exercise-id",
        name: "New Exercise",
      });

      await repo.save(otherExercise);

      const foundExercise = await repo.getById("other-exercise-id");

      expect(foundExercise!.id).toBe("other-exercise-id");
      expect(foundExercise!.name).toBe("New Exercise");
    });

    it("updates an existing exercise", async () => {
      exercise.rename("Renamed Exercise");

      await repo.save(exercise);

      const foundExercise = await repo.getById(exercise.id);

      expect(foundExercise!.name).toBe("Renamed Exercise");
    });

    it("returns saved exercise", async () => {
      const otherExercise = createTestExercise({
        id: "other-exercise-id",
        name: "New Exercise",
      });

      const savedExercise = await repo.save(otherExercise);

      expect(savedExercise).toBeInstanceOf(Exercise);
      expect(savedExercise.id).toBe("other-exercise-id");
      expect(savedExercise.name).toBe("New Exercise");
    });
  });

  describe("deleteById", () => {
    it("removes an existing exercise", async () => {
      await repo.deleteById(exercise.id);

      const foundExercise = await repo.getById(exercise.id);

      expect(foundExercise).toBeNull();
    });

    it("returns null when deleting non-existing id", async () => {
      const deletedExercise = await repo.deleteById("non-existent-id");

      expect(deletedExercise).toBeNull();
    });

    it("returns the deleted exercise", async () => {
      const deletedExercise = await repo.deleteById(exercise.id);

      expect(deletedExercise!.id).toBe(exercise.id);
    });
  });
});
