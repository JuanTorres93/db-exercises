import { NextFunction, Request, Response } from "express";

import { DeleteExerciseForUserUsecaseRequest } from "@/application-layer/use-cases/DeleteExerciseForUserUsecase/DeleteExerciseForUserUsecase";
import { GetExercisesByFuzzyNameUsecaseRequest } from "@/application-layer/use-cases/GetExercisesByFuzzyNameUsecase/GetExercisesByFuzzyNameUsecase";
import { RenameExerciseForUserIdUsecaseRequest } from "@/application-layer/use-cases/RenameExerciseForUserIdUsecase/RenameExerciseForUserIdUsecase";
import { AppDeleteExerciseForUserUsecase } from "@/interface-adapters/use-cases/AppDeleteExerciseForUserUsecase";
import { AppGetExercisesByFuzzyNameUsecase } from "@/interface-adapters/use-cases/AppGetExercisesByFuzzyNameUsecase";
import { AppRenameExerciseForUserIdUsecase } from "@/interface-adapters/use-cases/AppRenameExerciseForUserIdUsecase";

import { AddExerciseForUserUsecaseRequest } from "../../../application-layer/use-cases/AddExerciseForUserUsecase/AddExerciseForUserUsecase";
import { AppAddExerciseForUserUsecase } from "../../../interface-adapters/use-cases/AppAddExerciseForUserUsecase";
import { JSENDSuccess } from "../common/JSEND";

export async function createNewExercise(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const exerciseData: AddExerciseForUserUsecaseRequest = req.body;

    const newExercise =
      await AppAddExerciseForUserUsecase.execute(exerciseData);

    const jsend: JSENDSuccess<typeof newExercise> = {
      status: "success",
      data: newExercise,
    };

    res.status(201).json(jsend);
  } catch (error) {
    next(error);
  }
}

export async function renameExercise(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { exerciseId } = req.params;

    const renameData: RenameExerciseForUserIdUsecaseRequest = {
      ...req.body,
      exerciseId,
    };

    const renamedExercise =
      await AppRenameExerciseForUserIdUsecase.execute(renameData);

    const jsend: JSENDSuccess<typeof renamedExercise> = {
      status: "success",
      data: renamedExercise,
    };

    res.status(200).json(jsend);
  } catch (error) {
    next(error);
  }
}

export async function deleteExercise(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { exerciseId } = req.params;

    const deleteData: DeleteExerciseForUserUsecaseRequest = {
      ...req.body,
      exerciseId,
    };

    const deletedExercise =
      await AppDeleteExerciseForUserUsecase.execute(deleteData);

    const jsend: JSENDSuccess<typeof deletedExercise> = {
      status: "success",
      data: deletedExercise,
    };

    res.status(200).json(jsend);
  } catch (error) {
    next(error);
  }
}

export async function getExercisesByFuzzyName(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { fuzzyName } = req.params;
    const userId = req.query.userId as string;

    const searchData: GetExercisesByFuzzyNameUsecaseRequest = {
      name: fuzzyName as string,
      userId,
    };

    const exercises =
      await AppGetExercisesByFuzzyNameUsecase.execute(searchData);

    const jsend: JSENDSuccess<typeof exercises> = {
      status: "success",
      data: exercises,
    };

    res.status(200).json(jsend);
  } catch (error) {
    next(error);
  }
}
