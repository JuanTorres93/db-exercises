import {
  ExerciseDTO,
  toExerciseDTO,
} from "@/application-layer/dtos/ExerciseDTO";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";

export type GetExercisesByFuzzyNameUsecaseRequest = {
  name: string;
  userId: string;
};

export class GetExercisesByFuzzyNameUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(
    request: GetExercisesByFuzzyNameUsecaseRequest,
  ): Promise<ExerciseDTO[]> {
    const [userExercises, commonExercises] = await Promise.all([
      this.exercisesRepo.getByFuzzyNameAndUserId(request.name, request.userId),

      this.exercisesRepo.getCommonExercisesByFuzzyName(request.name),
    ]);

    const allExercises = [...userExercises, ...commonExercises];

    return allExercises.map(toExerciseDTO) || [];
  }
}
