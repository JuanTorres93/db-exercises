import { Exercise } from "@/domain/entities/exercise/Exercise";

import { createTestExercise } from "../../../../../tests/createProps/exerciseTestProps";
import { MemoryExercisesRepo } from "../MemoryExercisesRepo";

describe("MemoryExercisesRepo", () => {
  let repo: MemoryExercisesRepo;
  let exercise: Exercise;

  beforeEach(() => {
    exercise = createTestExercise();

    repo = new MemoryExercisesRepo();

    repo.save(exercise);
  });

  describe("getById", () => {});

  describe("getByUserId", () => {});

  describe("getByFuzzyName", () => {});

  describe("save", () => {});

  describe("deleteById", () => {});
});
