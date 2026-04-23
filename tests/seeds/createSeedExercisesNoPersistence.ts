import { createTestExercise } from "../createProps/exerciseTestProps";

export const USER_ONE_ID = "user-1";
export const USER_TWO_ID = "user-2";

export function getExercisesForUser(userId: string) {
  return createSeedExercisesNoPersistence().filter(
    (exercise) => exercise.userId === userId,
  );
}

export function getCommonExercises() {
  return createSeedExercisesNoPersistence().filter(
    (exercise) => !exercise.userId,
  );
}

export function createSeedExercisesNoPersistence() {
  return [
    createTestExercise({
      id: "ex1",
      name: "Test Exercise",
      userId: USER_ONE_ID,
    }),
    createTestExercise({
      id: "ex2",
      name: "Another Exercise",
      userId: USER_ONE_ID,
    }),
    createTestExercise({
      id: "ex3",
      name: "Yet Another Exercise",
      userId: USER_ONE_ID,
    }),

    createTestExercise({
      id: "ex4",
      name: "Some Exercise",
      userId: USER_TWO_ID,
    }),
    createTestExercise({
      id: "ex5",
      name: "Some Other Exercise",
      userId: USER_TWO_ID,
    }),

    createTestExercise({
      id: "ex6",
      name: "Different Exercise",
    }),
    createTestExercise({
      id: "ex7",
      name: "Unique Exercise",
    }),
    createTestExercise({
      id: "ex8",
      name: "Special Exercise",
    }),
    createTestExercise({
      id: "ex9",
      name: "Common Exercise",
    }),
    createTestExercise({
      id: "ex10",
      name: "Final Exercise",
    }),
  ];
}
