import { validExerciseProps as vp } from "@/../tests/createProps/exerciseTestProps";
import { ValidationError } from "@/domain/common/errors";

import { Exercise, ExerciseCreateProps } from "../Exercise";

describe("Exercise", () => {
  let exercise: Exercise;
  let validExerciseProps: ExerciseCreateProps;

  beforeEach(() => {
    validExerciseProps = {
      ...vp,
    };

    exercise = Exercise.create(validExerciseProps);
  });

  describe("Creation", () => {
    it("should create a valid exercise", () => {
      expect(exercise).toBeInstanceOf(Exercise);
    });

    it("should have id", async () => {
      expect(exercise.id).toBeDefined();
    });

    it("should have name", async () => {
      expect(exercise.name).toBe(validExerciseProps.name);
    });

    it("should have createdAt", async () => {
      expect(exercise.createdAt).toBeInstanceOf(Date);
    });

    it("should have updatedAt", async () => {
      expect(exercise.updatedAt).toBeInstanceOf(Date);
    });

    it("should have createdAt if not provided", async () => {
      const props = { ...vp, createdAt: undefined };

      const exercise = Exercise.create(props);
      expect(exercise.createdAt).toBeInstanceOf(Date);
    });

    it("should have updatedAt if not provided", async () => {
      const props = { ...vp, updatedAt: undefined };

      const exercise = Exercise.create(props);
      expect(exercise.updatedAt).toBeInstanceOf(Date);
    });

    it("may have a userId", async () => {
      const userId = "user-123";
      const props = { ...vp, userId };

      const exercise = Exercise.create(props);

      expect(exercise).toBeInstanceOf(Exercise);
      expect(exercise).toHaveProperty("userId");
    });
  });

  describe("methods", () => {
    it("should update name", async () => {
      const newName = "New Exercise Name";

      exercise.rename(newName);

      expect(exercise.name).toBe(newName);
    });
  });

  describe("Errors", () => {
    it("Name should not exceed 100 characters", async () => {
      const longName = "a".repeat(101);

      expect(() => Exercise.create({ ...vp, name: longName })).toThrow(
        ValidationError,
      );
      expect(() => Exercise.create({ ...vp, name: longName })).toThrow(
        /^Text:.*/,
      );
    });
  });
});
