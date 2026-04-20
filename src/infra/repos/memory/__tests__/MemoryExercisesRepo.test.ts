import { NotFoundError } from "@/domain/common/errors";
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
      const found = await repo.getById(exercise.id);

      expect(found).toBeInstanceOf(Exercise);
      expect(found.id).toBe(exercise.id);
    });

    it("throws NotFoundError when exercise does not exist", async () => {
      await expect(repo.getById("no-such-id")).rejects.toThrow(NotFoundError);

      await expect(repo.getById("no-such-id")).rejects.toThrow(
        /MemoryExercisesRepo:.*id.*not found/,
      );
    });
  });

  describe("getByUserId", () => {
    it("returns exercises that belong to a user", async () => {
      const ex2 = Exercise.create({
        id: "ex2",
        name: "Ex 2",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-1",
      });
      const ex3 = Exercise.create({
        id: "ex3",
        name: "Ex 3",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-2",
      });

      await repo.save(ex2);
      await repo.save(ex3);

      const results = await repo.getByUserId("user-1");

      expect(results.map((r) => r.id)).toEqual(["ex2"]);
    });

    it("returns an empty array when no exercises match", async () => {
      const results = await repo.getByUserId("non-existent-user");

      expect(results).toEqual([]);
    });
  });

  describe("getByFuzzyName", () => {
    it("returns exercises matching a fuzzy name (case-insensitive)", async () => {
      const ex2 = createTestExercise({ id: "ex2", name: "Push Up" });
      const ex3 = createTestExercise({ id: "ex3", name: "Pull Down" });

      await repo.save(ex2);
      await repo.save(ex3);

      const results = await repo.getByFuzzyName("push");

      expect(results.map((r) => r.id)).toEqual(["ex2"]);
    });
  });

  describe("save", () => {
    it("persists a new exercise and can be retrieved", async () => {
      const ex2 = createTestExercise({ id: "ex2", name: "New Exercise" });

      await repo.save(ex2);

      const found = await repo.getById("ex2");

      expect(found.id).toBe("ex2");
      expect(found.name).toBe("New Exercise");
    });

    it("updates an existing exercise", async () => {
      exercise.rename("Renamed Exercise");

      await repo.save(exercise);

      const found = await repo.getById(exercise.id);

      expect(found.name).toBe("Renamed Exercise");
    });

    it("returns saved exercise", async () => {
      const ex2 = createTestExercise({ id: "ex2", name: "New Exercise" });

      const savedExercise = await repo.save(ex2);

      expect(savedExercise).toBeInstanceOf(Exercise);
      expect(savedExercise.id).toBe("ex2");
      expect(savedExercise.name).toBe("New Exercise");
    });
  });

  describe("deleteById", () => {
    it("removes an existing exercise", async () => {
      await repo.deleteById(exercise.id);

      await expect(repo.getById(exercise.id)).rejects.toThrow(NotFoundError);
      await expect(repo.getById(exercise.id)).rejects.toThrow(
        /MemoryExercisesRepo:.*id.*not found/,
      );
    });

    it("throws NotFoundError when deleting non-existing id", async () => {
      await expect(repo.deleteById("nope")).rejects.toThrow(NotFoundError);
      await expect(repo.deleteById("nope")).rejects.toThrow(
        /MemoryExercisesRepo:.*id.*not found/,
      );
    });

    it("returns the deleted exercise", async () => {
      const deleted = await repo.deleteById(exercise.id);

      expect(deleted.id).toBe(exercise.id);
    });
  });
});
