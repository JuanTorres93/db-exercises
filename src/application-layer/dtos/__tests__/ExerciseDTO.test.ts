import { Exercise } from "@/domain/entities/exercise/Exercise";

import * as exerciseTestProps from "../../../../tests/createProps/exerciseTestProps";
import { exerciseDTOProperties } from "../../../../tests/dtoProperties/exerciseDtoProperties";
import { ExerciseDTO, toExercise, toExerciseDTO } from "../ExerciseDTO";

describe("ExerciseDTO", () => {
  let exercise: Exercise;
  let exerciseDTO: ExerciseDTO;

  beforeEach(() => {
    exercise = exerciseTestProps.createTestExercise({
      userId: "user-1",
    });
  });

  describe("toExerciseDTO", () => {
    beforeEach(() => {
      exerciseDTO = toExerciseDTO(exercise);
    });

    it("should have a prop for each exercise getter", () => {
      for (const getter of exerciseDTOProperties) {
        expect(exerciseDTO).toHaveProperty(getter);
      }
    });

    it("should convert Exercise to ExerciseDTO", () => {
      expect(exerciseDTO).toEqual({
        id: exercise.id,
        name: exercise.name,
        userId: exercise.userId,
        createdAt: exercise.createdAt.toISOString(),
        updatedAt: exercise.updatedAt.toISOString(),
      });
    });

    it("should convert dates to ISO strings", () => {
      expect(typeof exerciseDTO.createdAt).toBe("string");
      expect(typeof exerciseDTO.updatedAt).toBe("string");
      expect(exerciseDTO.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(exerciseDTO.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });

  describe("toExercise", () => {
    it("should convert ExerciseDTO back to Exercise", () => {
      const convertedExercise = toExercise({
        id: exerciseDTO.id,
        name: exerciseDTO.name,
        userId: exerciseDTO.userId,
        createdAt: exerciseDTO.createdAt,
        updatedAt: exerciseDTO.updatedAt,
      });

      expect(convertedExercise).toBeInstanceOf(Exercise);
      expect(convertedExercise.id).toBe(exercise.id);
      expect(convertedExercise.name).toBe(exercise.name);
      expect(convertedExercise.userId).toBe(exercise.userId);
      expect(convertedExercise.createdAt.toISOString()).toBe(
        exercise.createdAt.toISOString(),
      );
      expect(convertedExercise.updatedAt.toISOString()).toBe(
        exercise.updatedAt.toISOString(),
      );
    });
  });
});
