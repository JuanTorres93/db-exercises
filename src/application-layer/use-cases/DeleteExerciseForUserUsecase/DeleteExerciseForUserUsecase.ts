import {
  ExerciseDTO,
  toExerciseDTO,
} from "@/application-layer/dtos/ExerciseDTO";
import { NotFoundError, PermissionError } from "@/domain/common/errors";
import { Exercise } from "@/domain/entities/exercise/Exercise";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";

export type DeleteExerciseForUserUsecaseRequest = {
  exerciseId: string;
  userId: string;
};

export class DeleteExerciseForUserUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(
    request: DeleteExerciseForUserUsecaseRequest,
  ): Promise<ExerciseDTO> {
    const exercise = await this.exercisesRepo.getById(request.exerciseId);

    if (!exerciseExistsAndBelongsToUser(exercise, request.userId)) {
      throw new NotFoundError(
        `DeleteExerciseForUserUsecase: Exercise with id "${request.exerciseId}" not found`,
      );
    }

    await this.exercisesRepo.deleteById(request.exerciseId);

    return toExerciseDTO(exercise);
  }
}

function exerciseExistsAndBelongsToUser(
  exercise: Exercise | null,
  userId: string,
): exercise is Exercise {
  return !!exercise && exercise.userId === userId;
}
