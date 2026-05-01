import { ExerciseDTO, toExercise } from "@/application-layer/dtos/ExerciseDTO";
import { Exercise } from "@/domain/entities/exercise/Exercise";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";
import { PaginationParams } from "@/domain/repos/common/pagination";

import ExerciseMongo from "./models/ExerciseMongo";

export class MongooseExercisesRepo implements ExercisesRepo {
  async getById(id: string): Promise<Exercise | null> {
    const doc = await ExerciseMongo.findOne({ id }).lean();

    return doc ? toExercise(doc as ExerciseDTO) : null;
  }

  async getByUserId(
    userId: string,
    pagination?: PaginationParams,
  ): Promise<Exercise[]> {
    const docs = await ExerciseMongo.find({ userId }).lean();

    const exercises = docs.map((doc) => toExercise(doc as ExerciseDTO));

    return this.paginate(exercises, pagination);
  }

  async getCommonExercisesByFuzzyName(
    name: string,
    pagination?: PaginationParams,
  ): Promise<Exercise[]> {
    const docs = await ExerciseMongo.find({
      userId: { $exists: false },
      name: { $regex: escapeRegex(name), $options: "i" },
    }).lean();

    const exercises = docs.map((doc) => toExercise(doc as ExerciseDTO));

    return this.paginate(exercises, pagination);
  }

  async getCommonExerciseByName(name: string): Promise<Exercise | null> {
    const doc = await ExerciseMongo.findOne({
      userId: { $exists: false },
      name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
    }).lean();

    return doc ? toExercise(doc as ExerciseDTO) : null;
  }

  async getByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<Exercise | null> {
    const doc = await ExerciseMongo.findOne({
      userId,
      name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
    }).lean();

    return doc ? toExercise(doc as ExerciseDTO) : null;
  }

  async getByFuzzyNameAndUserId(
    name: string,
    userId: string,
  ): Promise<Exercise[]> {
    const docs = await ExerciseMongo.find({
      userId,
      name: { $regex: escapeRegex(name), $options: "i" },
    }).lean();

    return docs.map((doc) => toExercise(doc as ExerciseDTO));
  }

  async save(exercise: Exercise): Promise<Exercise> {
    await ExerciseMongo.findOneAndUpdate(
      { id: exercise.id },
      {
        ...exercise.toCreateProps(),
      },
      { upsert: true },
    );
    return exercise;
  }

  async deleteById(id: string): Promise<Exercise | null> {
    const doc = await ExerciseMongo.findOneAndDelete({ id }).lean();

    return doc ? toExercise(doc as ExerciseDTO) : null;
  }

  private paginate<T>(items: T[], pagination?: PaginationParams): T[] {
    if (!pagination) return items;

    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return items.slice(startIndex, endIndex);
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
