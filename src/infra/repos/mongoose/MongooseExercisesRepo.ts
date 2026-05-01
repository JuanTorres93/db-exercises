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
    const query = ExerciseMongo.find({ userId });
    this.paginate(query, pagination);

    const docs = await query.lean();

    return docs.map((doc) => toExercise(doc as ExerciseDTO));
  }

  async getCommonExercisesByFuzzyName(
    name: string,
    pagination?: PaginationParams,
  ): Promise<Exercise[]> {
    const query = ExerciseMongo.find({
      userId: { $exists: false },
      name: { $regex: escapeRegex(name), $options: "i" },
    });
    this.paginate(query, pagination);

    const docs = await query.lean();

    return docs.map((doc) => toExercise(doc as ExerciseDTO));
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
    pagination?: PaginationParams,
  ): Promise<Exercise[]> {
    const query = ExerciseMongo.find({
      userId,
      name: { $regex: escapeRegex(name), $options: "i" },
    });
    this.paginate(query, pagination);

    const docs = await query.lean();

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

  private paginate(
    query: ReturnType<typeof ExerciseMongo.find>,
    pagination?: PaginationParams,
  ): void {
    if (!pagination) return;

    const { page, limit } = pagination;

    query.skip((page - 1) * limit).limit(limit);
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
