import {
  ExerciseDTO,
  toExerciseDTO,
} from "@/application-layer/dtos/ExerciseDTO";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";
import { PaginationParams } from "@/domain/repos/common/pagination";

export type GetExercisesByFuzzyNameUsecaseRequest = {
  name: string;
  userId: string;
  page?: PaginationParams["page"];
  limit?: PaginationParams["limit"];
};

export class GetExercisesByFuzzyNameUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(
    request: GetExercisesByFuzzyNameUsecaseRequest,
  ): Promise<ExerciseDTO[]> {
    let pagination: PaginationParams | undefined = undefined;

    const userIdProvided = request.userId != null;

    if (request.page !== undefined && request.limit !== undefined) {
      // To get exercises correctly limited we need to divide limit by 2, since we are paginating user and common exercises separately and then merging results

      const adjustedLimit = userIdProvided
        ? Math.ceil(request.limit / 2)
        : request.limit;

      pagination = {
        page: request.page,
        limit: adjustedLimit,
      };
    }

    const userExercisesPromise = userIdProvided
      ? this.exercisesRepo.getByFuzzyNameAndUserId(
          request.name,
          request.userId,
          pagination,
        )
      : Promise.resolve([]);

    const [userExercises, commonExercises] = await Promise.all([
      userExercisesPromise,

      this.exercisesRepo.getCommonExercisesByFuzzyName(
        request.name,
        pagination,
      ),
    ]);

    const allExercises = [...userExercises, ...commonExercises];

    return allExercises.map(toExerciseDTO) || [];
  }
}
