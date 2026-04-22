import { Exercise } from "../entities/exercise/Exercise";

export interface ExercisesRepo {
  getById(id: string): Promise<Exercise>;
  getByUserId(userId: string): Promise<Exercise[]>;
  getByFuzzyName(name: string): Promise<Exercise[]>;
  getByNameAndUserId(name: string, userId: string): Promise<Exercise>;

  save(exercise: Exercise): Promise<Exercise>;

  deleteById(id: string): Promise<Exercise>;
}
