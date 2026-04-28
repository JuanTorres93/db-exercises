import { NotFoundApplicationError } from "@/application-layer/common/applicationErrors";
import { AlreadyExistsApplicationError } from "@/application-layer/common/applicationErrors";
import {
  ExerciseDTO,
  toExerciseDTO,
} from "@/application-layer/dtos/ExerciseDTO";
import { PermissionError } from "@/domain/common/domainErrors";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";

export type RenameExerciseForUserIdUsecaseRequest = {
  exerciseId: string;
  userId: string;
  newName: string;
};

export class RenameExerciseForUserIdUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(
    request: RenameExerciseForUserIdUsecaseRequest,
  ): Promise<ExerciseDTO> {
    const [exercise, existingExercise] = await Promise.all([
      this.exercisesRepo.getById(request.exerciseId),

      this.exercisesRepo.getByNameAndUserId(request.newName, request.userId),
    ]);

    if (!exercise) {
      throw new NotFoundApplicationError(
        `RenameExerciseForUserIdUsecase: Exercise with id "${request.exerciseId}" not found`,
      );
    }

    if (exercise.userId !== request.userId) {
      throw new PermissionError(
        `RenameExerciseForUserIdUsecase: Exercise with id "${request.exerciseId}" does not belong to user "${request.userId}"`,
      );
    }

    if (existingExercise) {
      throw new AlreadyExistsApplicationError(
        `RenameExerciseForUserIdUsecase: Exercise with name "${request.newName}" already exists for userId "${request.userId}"`,
      );
    }

    exercise.rename(request.newName);

    await this.exercisesRepo.save(exercise);

    return toExerciseDTO(exercise);
  }
}
