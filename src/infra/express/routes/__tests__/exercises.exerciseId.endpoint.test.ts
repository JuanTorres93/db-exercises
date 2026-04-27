import request from "supertest";

import { DeleteExerciseForUserUsecaseRequest } from "@/application-layer/use-cases/DeleteExerciseForUserUsecase/DeleteExerciseForUserUsecase";
import { RenameExerciseForUserIdUsecaseRequest } from "@/application-layer/use-cases/RenameExerciseForUserIdUsecase/RenameExerciseForUserIdUsecase";
import { AppExercisesRepo } from "@/interface-adapters/repos/AppExercisesRepo";

import { USER_ONE_ID } from "../../../../../tests/seeds/createSeedExercisesNoPersistence";
import app from "../../app";
import {
  getExistingExercise,
  setupExercisesRouteTests,
} from "./setupExercisesRouteTests";

describe("PUT /exercises/:exerciseId", () => {
  setupExercisesRouteTests();

  const renameExerciseBody: RenameExerciseRequestBody = {
    newName: "New name for exercise",
    userId: USER_ONE_ID,
  };

  it("should return 200 status", async () => {
    const existingExercise = await getExistingExercise();

    const response = await request(app)
      .put(`/exercises/${existingExercise.id}`)
      .send(renameExerciseBody);

    expect(response.status).toBe(200);
  });

  it("should return JSEND on success with new exercise", async () => {
    const existingExercise = await getExistingExercise();

    const response = await request(app)
      .put(`/exercises/${existingExercise.id}`)
      .send(renameExerciseBody);

    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");

    expect(response.body.data).toHaveProperty("id", existingExercise.id);
    expect(response.body.data).toHaveProperty(
      "name",
      renameExerciseBody.newName,
    );
    expect(response.body.data).toHaveProperty(
      "userId",
      renameExerciseBody.userId,
    );
  });

  it("should save new name in repo", async () => {
    const existingExercise = await getExistingExercise();

    await request(app)
      .put(`/exercises/${existingExercise.id}`)
      .send(renameExerciseBody);

    const renamedExercise = await AppExercisesRepo.getById(existingExercise.id);

    expect(renamedExercise).toBeDefined();
    expect(renamedExercise!.name).toBe(renameExerciseBody.newName);
  });

  describe("Errors", () => {
    it("should return 409 if an exercise with the same name already exists", async () => {
      const existingExercise = await getExistingExercise();

      const response = await request(app)
        .put(`/exercises/${existingExercise.id}`)
        .send({
          ...renameExerciseBody,
          newName: existingExercise.name,
        });

      expect(response.status).toBe(409);
    });

    it("should return JSEND fail if an exercise with the same name already exists", async () => {
      const existingExercise = await getExistingExercise();

      const response = await request(app)
        .put(`/exercises/${existingExercise.id}`)
        .send({
          ...renameExerciseBody,
          newName: existingExercise.name,
        });

      expect(response.body).toHaveProperty("status", "fail");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty(
        "name",
        "An exercise with the same name already exists",
      );
    });

    it("should return 404 if the exercise does not exist", async () => {
      const nonExistentExerciseId = "non-existent-id";

      const response = await request(app)
        .put(`/exercises/${nonExistentExerciseId}`)
        .send(renameExerciseBody);

      expect(response.status).toBe(404);
    });

    it("should return JSEND fail if the exercise does not exist", async () => {
      const nonExistentExerciseId = "non-existent-id";

      const response = await request(app)
        .put(`/exercises/${nonExistentExerciseId}`)
        .send(renameExerciseBody);

      expect(response.body).toHaveProperty("status", "fail");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty(
        "exerciseId",
        "The exercise does not exist",
      );
    });

    it("should return 404 if a user tries to rename an exercise that does not belong to them", async () => {
      const existingExercise = await getExistingExercise();

      const response = await request(app)
        .put(`/exercises/${existingExercise.id}`)
        .send({
          ...renameExerciseBody,
          userId: "some-other-user-id",
        });

      expect(response.status).toBe(404);
    });
  });
});

type RenameExerciseRequestBody = Omit<
  RenameExerciseForUserIdUsecaseRequest,
  "exerciseId"
>;

describe("DELETE /exercises/:exerciseId", () => {
  setupExercisesRouteTests();

  const deleteExerciseBody: DeleteExerciseRequestBody = {
    userId: USER_ONE_ID,
  };

  it("should return 200 status", async () => {
    const existingExercise = await getExistingExercise();

    const response = await request(app)
      .delete(`/exercises/${existingExercise.id}`)
      .send(deleteExerciseBody);

    expect(response.status).toBe(200);
  });

  it("should return JSEND success with the deleted exercise", async () => {
    const existingExercise = await getExistingExercise();

    const response = await request(app)
      .delete(`/exercises/${existingExercise.id}`)
      .send(deleteExerciseBody);

    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("id", existingExercise.id);
    expect(response.body.data).toHaveProperty("userId", USER_ONE_ID);
  });

  it("should remove the exercise from the repo", async () => {
    const existingExercise = await getExistingExercise();

    await request(app)
      .delete(`/exercises/${existingExercise.id}`)
      .send(deleteExerciseBody);

    const found = await AppExercisesRepo.getById(existingExercise.id);
    expect(found).toBeNull();
  });

  describe("Errors", () => {
    it("should return 404 if the exercise does not exist", async () => {
      const response = await request(app)
        .delete("/exercises/non-existent-id")
        .send(deleteExerciseBody);

      expect(response.status).toBe(404);
    });

    it("should return JSEND fail if the exercise does not exist", async () => {
      const response = await request(app)
        .delete("/exercises/non-existent-id")
        .send(deleteExerciseBody);

      expect(response.body).toHaveProperty("status", "fail");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty(
        "exerciseId",
        "The exercise does not exist",
      );
    });

    it("should return 404 if the exercise does not belong to the user", async () => {
      const existingExercise = await getExistingExercise();

      const response = await request(app)
        .delete(`/exercises/${existingExercise.id}`)
        .send({ userId: "other-user" });

      expect(response.status).toBe(404);
    });

    it("should return JSEND fail if the exercise does not belong to the user", async () => {
      const existingExercise = await getExistingExercise();

      const response = await request(app)
        .delete(`/exercises/${existingExercise.id}`)
        .send({ userId: "other-user" });

      expect(response.body).toHaveProperty("status", "fail");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty(
        "exerciseId",
        "The exercise does not exist",
      );
    });
  });
});

type DeleteExerciseRequestBody = Omit<
  DeleteExerciseForUserUsecaseRequest,
  "exerciseId"
>;
