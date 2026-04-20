import { Exercise } from "../entities/exercise/Exercise";

export interface ExercisesRepo {
  getById(id: string): Promise<Exercise>;
  getByUserId(userId: string): Promise<Exercise[]>;
  getByFuzzyName(name: string): Promise<Exercise[]>;

  save(exercise: Exercise): Promise<void>;

  deleteById(id: string): Promise<void>;
}
