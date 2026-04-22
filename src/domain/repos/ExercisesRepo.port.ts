import { Exercise } from "../entities/exercise/Exercise";

export interface ExercisesRepo {
  getById(id: string): Promise<Exercise | null>;
  getByUserId(userId: string): Promise<Exercise[]>;
  getByFuzzyName(name: string): Promise<Exercise[]>;
  getByNameAndUserId(name: string, userId?: string): Promise<Exercise | null>;

  save(exercise: Exercise): Promise<Exercise>;

  deleteById(id: string): Promise<Exercise | null>;
}
