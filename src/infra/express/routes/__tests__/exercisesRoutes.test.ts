import request from "supertest";

import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { AppExercisesRepo } from "@/interface-adapters/repos/AppExercisesRepo";

import { createExercisesInRepoAndCleanAfterEach } from "../../__tests__/createExercisesInRepoAndCleanAfterEach";
import app from "../../app";

describe("Exercises Routes", () => {
  beforeEach(async () => {
    await createExercisesInRepoAndCleanAfterEach();

    if (!(AppExercisesRepo instanceof MemoryExercisesRepo))
      throw new Error(
        "AppExercisesRepo must be an instance of MemoryExercisesRepo",
      );
  });

  describe("GET /exercises", () => {
    it("should return status 200", async () => {
      const response = await request(app).get("/exercises");

      expect(response.status).toBe(200);
    });

    //it("should return JSEND success format", async () => {
    //  const response = await request(app).get("/exercises");

    //  expect(response.body.status).toBe("success");
    //  expect(response.body).toHaveProperty("data");
    //});
  });
});
