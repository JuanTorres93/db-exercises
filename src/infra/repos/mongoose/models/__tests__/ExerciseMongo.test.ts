import { exerciseDTOProperties } from "../../../../../../tests/dtoProperties/exerciseDtoProperties";
import ExerciseMongo from "../ExerciseMongo";
import { assertMongooseModelMatchesDTOProperties } from "./assertMongooseSchemaMatchesProperties";

describe("ExerciseMongo", () => {
  it("should have (at least) same properties as DTO", () => {
    assertMongooseModelMatchesDTOProperties(
      ExerciseMongo,
      exerciseDTOProperties,
    );
  });
});
