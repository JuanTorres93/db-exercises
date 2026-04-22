import {
  ExerciseDTO,
  toExerciseDTO,
} from "@/application-layer/dtos/ExerciseDTO";
import { IdGenerator } from "@/application-layer/services/IdGenerator.port";
import { AlreadyExistsError } from "@/domain/common/errors";
import { Exercise } from "@/domain/entities/exercise/Exercise";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";

export type AddCommonExerciseUsecaseRequest = {
  name: string;
};

export class AddCommonExerciseUsecase {
  constructor(
    private exercisesRepo: ExercisesRepo,
    private idGenerator: IdGenerator,
  ) {}

  async execute(
    request: AddCommonExerciseUsecaseRequest,
  ): Promise<ExerciseDTO> {
    const existingExercise = await this.exercisesRepo.getCommonExerciseByName(
      request.name,
    );

    if (existingExercise) {
      throw new AlreadyExistsError(
        `AddCommonExerciseUsecase: Exercise with name "${request.name}" already exists.`,
      );
    }

    const exercise = Exercise.create({
      id: this.idGenerator.generateId(),
      name: request.name,
    });

    await this.exercisesRepo.save(exercise);

    return toExerciseDTO(exercise);
  }
}
