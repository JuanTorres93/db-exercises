import { NotFoundApplicationError } from "@/application-layer/common/applicationErrors";
import { AlreadyExistsApplicationError } from "@/application-layer/common/applicationErrors";
import { PermissionApplicationError } from "@/application-layer/common/applicationErrors";
import {
  ExerciseDTO,
  toExerciseDTO,
} from "@/application-layer/dtos/ExerciseDTO";
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
        "exerciseId",
        "The exercise does not exist",
      );
    }

    if (exercise.userId !== request.userId) {
      throw new PermissionApplicationError(
        "exerciseId",
        "The exercise does not exist",
      );
    }

    if (existingExercise) {
      throw new AlreadyExistsApplicationError(
        "name",
        "An exercise with the same name already exists",
      );
    }

    exercise.rename(request.newName);

    await this.exercisesRepo.save(exercise);

    return toExerciseDTO(exercise);
  }
}
