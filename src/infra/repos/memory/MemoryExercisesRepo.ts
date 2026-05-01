import { Exercise } from "@/domain/entities/exercise/Exercise";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";
import { PaginationParams } from "@/domain/repos/common/pagination";

export class MemoryExercisesRepo implements ExercisesRepo {
  private exercises: Map<string, Exercise> = new Map();

  async getById(id: string): Promise<Exercise | null> {
    const exercise = this.exercises.get(id) ?? null;

    return exercise;
  }

  async getByUserId(
    userId: string,
    pagination?: PaginationParams,
  ): Promise<Exercise[]> {
    const exercises = Array.from(this.exercises.values()).filter(
      (exercise) => exercise.userId === userId,
    );

    return this.paginate(exercises, pagination);
  }

  async getCommonExercisesByFuzzyName(
    name: string,
    pagination?: PaginationParams,
  ): Promise<Exercise[]> {
    const processedName = name.toLowerCase();

    const exercises = Array.from(this.exercises.values()).filter(
      (exercise) =>
        !exercise.userId && exercise.name.toLowerCase().includes(processedName),
    );

    return this.paginate(exercises, pagination);
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
    pagination?: PaginationParams,
  ): Promise<Exercise[]> {
    const processedName = name.toLowerCase();

    const exercises = Array.from(this.exercises.values()).filter(
      (exercise) =>
        (userId ? exercise.userId === userId : !exercise.userId) &&
        exercise.name.toLowerCase().includes(processedName),
    );

    return this.paginate(exercises, pagination);
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

  private paginate(
    items: Exercise[],
    pagination?: PaginationParams,
  ): Exercise[] {
    if (!pagination) return items;

    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return items.slice(startIndex, endIndex);
  }

  clearForTesting() {
    this.exercises.clear();
  }

  getAllForTesting() {
    return Array.from(this.exercises.values());
  }
}
