import { Exercise } from "../entities/exercise/Exercise";

export interface ExercisesRepo {
  getById(id: string): Promise<Exercise | null>;
  getByUserId(userId: string): Promise<Exercise[]>;

  getCommonExercisesByFuzzyName(name: string): Promise<Exercise[]>;
  getCommonExerciseByName(name: string): Promise<Exercise | null>;

  getByNameAndUserId(name: string, userId: string): Promise<Exercise | null>;
  getByFuzzyNameAndUserId(name: string, userId: string): Promise<Exercise[]>;

  save(exercise: Exercise): Promise<Exercise>;

  deleteById(id: string): Promise<Exercise | null>;
}
