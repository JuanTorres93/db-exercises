import { Exercise } from "@/domain/entities/exercise/Exercise";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";

export class MemoryExercisesRepo implements ExercisesRepo {
  private exercises: Map<string, Exercise> = new Map();

  async getById(id: string): Promise<Exercise | null> {
    const exercise = this.exercises.get(id) ?? null;

    return exercise;
  }

  async getByUserId(userId: string): Promise<Exercise[]> {
    const exercises = Array.from(this.exercises.values());

    return exercises.filter((exercise) => exercise.userId === userId);
  }

  async getCommonExercisesByFuzzyName(name: string): Promise<Exercise[]> {
    const processedName = name.toLowerCase();

    const exercises = Array.from(this.exercises.values());

    return exercises.filter(
      (exercise) =>
        !exercise.userId && exercise.name.toLowerCase().includes(processedName),
    );
  }

  async getCommonExerciseByName(name: string): Promise<Exercise | null> {
    const processedName = name.toLowerCase();

    const exercises = Array.from(this.exercises.values());

    const foundExercise = exercises.find(
      (exercise) =>
        !exercise.userId && exercise.name.toLowerCase() === processedName,
    );

    return foundExercise ?? null;
  }

  async getByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<Exercise | null> {
    const processedName = name.toLowerCase();

    const exercises = Array.from(this.exercises.values());

    const foundExercise = exercises.find(
      (exercise) =>
        (userId ? exercise.userId === userId : !exercise.userId) &&
        exercise.name.toLowerCase() === processedName,
    );

    return foundExercise ?? null;
  }

  async getByFuzzyNameAndUserId(
    name: string,
    userId: string,
  ): Promise<Exercise[]> {
    const processedName = name.toLowerCase();

    const exercises = Array.from(this.exercises.values());

    return exercises.filter(
      (exercise) =>
        (userId ? exercise.userId === userId : !exercise.userId) &&
        exercise.name.toLowerCase().includes(processedName),
    );
  }

  async save(exercise: Exercise): Promise<Exercise> {
    this.exercises.set(exercise.id, exercise);

    return exercise;
  }

  async deleteById(id: string): Promise<Exercise | null> {
    if (!this.exercises.has(id)) return null;

    const exercise = this.exercises.get(id) ?? null;

    this.exercises.delete(id);

    return exercise;
  }

  clearForTesting() {
    this.exercises.clear();
  }
}
