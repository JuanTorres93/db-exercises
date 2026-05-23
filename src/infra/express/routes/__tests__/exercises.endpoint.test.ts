import request from "supertest";

import { AddExerciseForUserUsecaseRequest } from "@/application-layer/use-cases/AddExerciseForUserUsecase/AddExerciseForUserUsecase";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { AppExercisesRepo } from "@/interface-adapters/repos/AppExercisesRepo";

import { USER_ONE_ID } from "../../../../../tests/seeds/createSeedExercisesNoPersistence";
import { requestWithAPIHeader } from "../../__tests__/requestWithAPIHeader";
import app from "../../app";
import {
  getExistingExercise,
  setupExercisesRouteTests,
} from "./setupExercisesRouteTests";

const appExercisesRepo = AppExercisesRepo as MemoryExercisesRepo;

describe("Exercises Endpoint", () => {
  it("shoould return error if no API key header is provided", () => {
    return request(app).get("/exercises").expect(401);
  });

  it("shoould return error if invalid API key is provided", () => {
    return request(app)
      .get("/exercises")
      .set("x-api-key", "invalid_key")
      .expect(403);
  });
});

describe("POST /exercises", () => {
  setupExercisesRouteTests();

  const newUserExerciseBody: AddExerciseForUserUsecaseRequest = {
    name: "New Exercise",
    userId: USER_ONE_ID,
  };

  it("should return 201 status", async () => {
    const response = await requestWithAPIHeader(app)
      .post("/exercises")
      .send(newUserExerciseBody);

    expect(response.status).toBe(201);
  });

  it("should return JSEND on success with new exercise", async () => {
    const response = await requestWithAPIHeader(app)
      .post("/exercises")
      .send(newUserExerciseBody);

    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.name).toBe(newUserExerciseBody.name);
    expect(response.body.data.userId).toBe(newUserExerciseBody.userId);
  });

  it("should persist new exercise in repo", async () => {
    const exercisesBefore = appExercisesRepo.getAllForTesting();

    await requestWithAPIHeader(app)
      .post("/exercises")
      .send(newUserExerciseBody);

    const exercisesAfter = appExercisesRepo.getAllForTesting();

    expect(exercisesAfter.length).toBe(exercisesBefore.length + 1);
  });

  describe("Errors", () => {
    let duplicatedExerciseRequestBody: AddExerciseForUserUsecaseRequest;

    beforeAll(async () => {
      const existingExercise = await getExistingExercise();

      duplicatedExerciseRequestBody = {
        ...newUserExerciseBody,
        name: existingExercise.name,
      };
    });

    it("should return 409 if an exercise with the same name already exists", async () => {
      const response = await requestWithAPIHeader(app)
        .post("/exercises")
        .send(duplicatedExerciseRequestBody);

      expect(response.status).toBe(409);
    });

    it("should return JSEND fail if an exercise with the same name already exists", async () => {
      const response = await requestWithAPIHeader(app)
        .post("/exercises")
        .send(duplicatedExerciseRequestBody);

      expect(response.body).toHaveProperty("status", "fail");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty(
        "name",
        "An exercise with the same name already exists",
      );
    });
  });
});
