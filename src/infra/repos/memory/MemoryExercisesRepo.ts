import { NotFoundError } from "@/domain/common/errors";
import { Exercise } from "@/domain/entities/exercise/Exercise";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";

export class MemoryExercisesRepo implements ExercisesRepo {
  private exercises: Map<string, Exercise> = new Map();

  async getById(id: string): Promise<Exercise> {
    const exercise = this.exercises.get(id);

    if (!exercise)
      throw new NotFoundError(
        `MemoryExercisesRepo: Exercise with id ${id} not found`,
      );

    return exercise;
  }

  async getByUserId(userId: string): Promise<Exercise[]> {
    const exercises = Array.from(this.exercises.values());

    return exercises.filter((exercise) => exercise.userId === userId);
  }

  async getByFuzzyName(name: string): Promise<Exercise[]> {
    const processedName = name.toLowerCase();

    const exercises = Array.from(this.exercises.values());

    return exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(processedName),
    );
  }

  async getByNameAndUserId(name: string, userId: string): Promise<Exercise> {
    const processedName = name.toLowerCase();

    const exercises = Array.from(this.exercises.values());

    const foundExercise = exercises.find(
      (exercise) =>
        exercise.userId === userId &&
        exercise.name.toLowerCase() === processedName,
    );

    if (!foundExercise)
      throw new NotFoundError(
        `MemoryExercisesRepo: Exercise with name ${name} and userId ${userId} not found`,
      );

    return foundExercise;
  }

  async save(exercise: Exercise): Promise<Exercise> {
    this.exercises.set(exercise.id, exercise);

    return exercise;
  }

  async deleteById(id: string): Promise<Exercise> {
    if (!this.exercises.has(id))
      throw new NotFoundError(
        `MemoryExercisesRepo: Exercise with id ${id} not found`,
      );

    const exercise = this.exercises.get(id)!;

    this.exercises.delete(id);

    return exercise;
  }
}
