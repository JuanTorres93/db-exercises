import {
  ExerciseDTO,
  toExerciseDTO,
} from "@/application-layer/dtos/ExerciseDTO";
import { IdGenerator } from "@/application-layer/services/IdGenerator.port";
import { AlreadyExistsError } from "@/domain/common/errors";
import { Exercise } from "@/domain/entities/exercise/Exercise";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";

export type AddExerciseUsecaseRequest = {
  name: string;
  userId?: string;
};

export class AddExerciseUsecase {
  constructor(
    private exercisesRepo: ExercisesRepo,
    private idGenerator: IdGenerator,
  ) {}

  async execute(request: AddExerciseUsecaseRequest): Promise<ExerciseDTO> {
    const existingExercise = await this.exercisesRepo.getByNameAndUserId(
      request.name,
      request.userId,
    );

    if (existingExercise) {
      throw new AlreadyExistsError(
        `AddExerciseUsecase: Exercise with name "${request.name}" already exists for userId "${request.userId}".`,
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
