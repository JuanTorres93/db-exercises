import { Exercise } from "@/domain/entities/exercise/Exercise";

import { createTestExercise } from "../../../../tests/createProps/exerciseTestProps";
import { MemoryExercisesRepo } from "../memory/MemoryExercisesRepo";
import { MongooseExercisesRepo } from "../mongoose/MongooseExercisesRepo";
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from "../mongoose/__tests__/setupMongoTestDB";

const repos = [
  { name: "MemoryExercisesRepo", repoClass: MemoryExercisesRepo },
  {
    name: "MongooseExercisesRepo",
    repoClass: MongooseExercisesRepo,
  },
];

repos.forEach(({ name, repoClass }) => {
  describe(name, () => {
    let repo: InstanceType<typeof repoClass>;
    let exercise: Exercise;

    beforeAll(async () => {
      if (name === "MongooseExercisesRepo") await setupMongoTestDB();
    });

    beforeEach(async () => {
      if (name === "MongooseExercisesRepo") await clearMongoTestDB();

      exercise = createTestExercise();

      repo = new repoClass();

      await repo.save(exercise);
    });

    afterAll(async () => {
      if (name === "MongooseExercisesRepo") await teardownMongoTestDB();
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
        const otherExercise = createTestExercise({
          id: "other-exercise-id",
          name: "Ex 2",
          userId: "user-1",
        });

        const anotherDifferentExercise = createTestExercise({
          id: "ex3",
          name: "Ex 3",
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

      it("can paginate results", async () => {
        const exercisesToAdd = Array.from({ length: 15 }, (_, i) =>
          createTestExercise({
            id: `exercise-${i + 2}`,
            name: `Exercise ${i + 2}`,
            userId: "user-1",
          }),
        );

        for (const exercise of exercisesToAdd) {
          await repo.save(exercise);
        }

        const exercises = await repo.getByUserId("user-1", {
          page: 2,
          limit: 5,
        });

        expect(exercises.length).toBe(5);
      });
    });

    describe("getCommonExerciseByFuzzyName", () => {
      it("returns exercises matching a fuzzy name", async () => {
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

        const foundExercises = await repo.getCommonExercisesByFuzzyName("push");

        expect(foundExercises.map((exercise) => exercise.id)).toEqual([
          "other-exercise-id",
        ]);
      });

      it("returns an empty array when no exercises match", async () => {
        const foundExercises =
          await repo.getCommonExercisesByFuzzyName("non-existent-name");

        expect(foundExercises).toEqual([]);
      });

      it("does not return user specific exercises", async () => {
        const userExercise = createTestExercise({
          id: "user-exercise-id",
          name: "User Exercise",
          userId: "user-1",
        });

        await repo.save(userExercise);

        const foundExercises =
          await repo.getCommonExercisesByFuzzyName("user exercise");

        expect(foundExercises).toEqual([]);
      });

      it("can paginate results", async () => {
        const exercisesToAdd = Array.from({ length: 15 }, (_, i) =>
          createTestExercise({
            id: `exercise-${i + 2}`,
            name: `Common Exercise ${i + 2}`,
          }),
        );

        for (const exercise of exercisesToAdd) {
          await repo.save(exercise);
        }

        const foundExercises = await repo.getCommonExercisesByFuzzyName(
          "common exercise",
          {
            page: 2,
            limit: 5,
          },
        );

        expect(foundExercises.length).toBe(5);
      });
    });

    describe("getCommonExerciseByName", () => {
      it("returns common exercise matching a name ", async () => {
        const commonExercise = createTestExercise({
          id: "common-exercise-id",
          name: "Common Exercise",
        });

        const userExercise = createTestExercise({
          id: "user-exercise-id",
          name: "Common Exercise",
          userId: "user-1",
        });

        await repo.save(commonExercise);
        await repo.save(userExercise);

        const foundExercise =
          await repo.getCommonExerciseByName("common exercise");

        expect(foundExercise!.id).toBe("common-exercise-id");
      });

      it("returns null when no common exercises match", async () => {
        const foundExercise =
          await repo.getCommonExerciseByName("non-existent-name");

        expect(foundExercise).toBeNull();
      });

      it("should not return user exercises even if name matches", async () => {
        const userExercise = createTestExercise({
          id: "user-exercise-id",
          name: "User Exercise",
          userId: "user-1",
        });

        await repo.save(userExercise);

        const foundExercise =
          await repo.getCommonExerciseByName("user exercise");

        expect(foundExercise).toBeNull();
      });
    });

    describe("getByNameAndUserId", () => {
      it("returns the exercise matching name and userId", async () => {
        const otherExercise = createTestExercise({
          id: "other-exercise-id",
          name: "My Exercise",
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

      it("should not return common exercises", async () => {
        const commonExercise = createTestExercise({
          id: "common-exercise-id",
          name: "Common Exercise",
        });

        await repo.save(commonExercise);

        const foundExercise = await repo.getByNameAndUserId(
          "common exercise",
          "user-1",
        );

        expect(foundExercise).toBeNull();
      });
    });

    describe("getByFuzzyNameAndUserId", () => {
      it("returns exercises matching a fuzzy name and userId", async () => {
        const otherExercise = createTestExercise({
          id: "other-exercise-id",
          name: "My Exercise",
          userId: "user-1",
        });

        await repo.save(otherExercise);

        const foundExercises = await repo.getByFuzzyNameAndUserId(
          "my exercise",
          "user-1",
        );

        expect(foundExercises.map((exercise) => exercise.id)).toEqual([
          "other-exercise-id",
        ]);
      });

      it("should return an empty array when no exercise is found", async () => {
        const foundExercises = await repo.getByFuzzyNameAndUserId(
          "non-existent-name",
          "user-1",
        );

        expect(foundExercises).toEqual([]);
      });

      it("should not return common exercises", async () => {
        const commonExercise = createTestExercise({
          id: "common-exercise-id",
          name: "Common Exercise",
        });

        await repo.save(commonExercise);

        const foundExercises = await repo.getByFuzzyNameAndUserId(
          "common exercise",
          "user-1",
        );

        expect(foundExercises).toEqual([]);
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
});
