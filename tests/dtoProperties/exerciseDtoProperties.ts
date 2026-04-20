import { getGetters } from "@/application-layer/dtos/__tests__/_getGettersUtil";
import { Exercise } from "@/domain/entities/exercise/Exercise";

import { validExerciseProps } from "../createProps/exerciseTestProps";

// Exercise DTO
const sampleExercise = Exercise.create({
  ...validExerciseProps,
});
export const exerciseDTOProperties = getGetters(sampleExercise);
