import { AlreadyExistsApplicationError } from "@/application-layer/common/applicationErrors";
import { ValidationApplicationError } from "@/application-layer/common/applicationErrors";
import {
  ExerciseDTO,
  toExerciseDTO,
} from "@/application-layer/dtos/ExerciseDTO";

import { IdGenerator } from "../../../application-layer/services/IdGenerator.port";
import { Exercise } from "../../../domain/entities/exercise/Exercise";
import { ExercisesRepo } from "../../../domain/repos/ExercisesRepo.port";

export type AddExerciseForUserUsecaseRequest = {
  name: string;
  userId: string;
};

export class AddExerciseForUserUsecase {
  constructor(
    private exercisesRepo: ExercisesRepo,
    private idGenerator: IdGenerator,
  ) {}

  async execute(
    request: AddExerciseForUserUsecaseRequest,
  ): Promise<ExerciseDTO> {
    if (!request.userId) {
      throw new ValidationApplicationError("userId", "User ID is required");
    }

    const existingExercise = await this.exercisesRepo.getByNameAndUserId(
      request.name,
      request.userId,
    );

    if (existingExercise) {
      throw new AlreadyExistsApplicationError(
        "name",
        "An exercise with the same name already exists",
      );
    }

    const exercise = Exercise.create({
      id: this.idGenerator.generateId(),
      name: request.name,
      userId: request.userId,
    });

    await this.exercisesRepo.save(exercise);

    return toExerciseDTO(exercise);
  }
}
