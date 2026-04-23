import { NextFunction, Request, Response } from "express";

import { AddExerciseForUserUsecaseRequest } from "../../../application-layer/use-cases/AddExerciseForUserUsecase/AddExerciseForUserUsecase";
import {
  AlreadyExistsError,
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
