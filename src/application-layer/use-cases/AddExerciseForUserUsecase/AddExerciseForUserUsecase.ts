import {
  ExerciseDTO,
  toExerciseDTO,
} from "@/application-layer/dtos/ExerciseDTO";

import { IdGenerator } from "../../../application-layer/services/IdGenerator.port";
import {
  AlreadyExistsError,
  ValidationError,
} from "../../../domain/common/errors";
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
      throw new ValidationError(
        "AddExerciseForUserUsecase: User ID is required",
      );
    }

    const existingExercise = await this.exercisesRepo.getByNameAndUserId(
      request.name,
      request.userId,
    );

    if (existingExercise) {
      throw new AlreadyExistsError(
        `AddExerciseForUserUsecase: Exercise with name "${request.name}" already exists for userId "${request.userId}".`,
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
