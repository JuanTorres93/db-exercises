import { NextFunction, Request, Response } from "express";

import { RenameExerciseForUserIdUsecaseRequest } from "@/application-layer/use-cases/RenameExerciseForUserIdUsecase/RenameExerciseForUserIdUsecase";
import { AppRenameExerciseForUserIdUsecase } from "@/interface-adapters/use-cases/AppRenameExerciseForUserIdUsecase";

import { AddExerciseForUserUsecaseRequest } from "../../../application-layer/use-cases/AddExerciseForUserUsecase/AddExerciseForUserUsecase";
import {
  AlreadyExistsError,
  NotFoundError,
  PermissionError,
  ValidationError,
} from "../../../domain/common/errors";
import { AppAddExerciseForUserUsecase } from "../../../interface-adapters/use-cases/AppAddExerciseForUserUsecase";
import { JSENDFailure, JSENDSuccess } from "../common/JSEND";

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
    const jsend: JSENDFailure = {
      status: "fail",
      data: {},
    };

    if (error instanceof AlreadyExistsError) {
      jsend.data = {
        name: "An exercise with the same name already exists",
      };

      return res.status(409).json(jsend);
    }

    if (error instanceof ValidationError) {
      jsend.data = {
        userId: "A userId is required",
      };

      return res.status(400).json(jsend);
    }

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
    const jsend: JSENDFailure = {
      status: "fail",
      data: {},
    };

    if (error instanceof AlreadyExistsError) {
      jsend.data = {
        name: "An exercise with the same name already exists",
      };

      return res.status(409).json(jsend);
    }

    if (error instanceof NotFoundError || error instanceof PermissionError) {
      jsend.data = {
        exerciseId: "The exercise does not exist",
      };

      return res.status(404).json(jsend);
    }

    next(error);
  }
}
