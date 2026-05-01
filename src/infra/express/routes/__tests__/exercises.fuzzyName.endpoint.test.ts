import request from "supertest";

import { USER_ONE_ID } from "../../../../../tests/seeds/createSeedExercisesNoPersistence";
import app from "../../app";
import { setupExercisesRouteTests } from "./setupExercisesRouteTests";

describe("GET /exercises/:fuzzyName", () => {
  setupExercisesRouteTests();

  it("should return 200 status", async () => {
    const response = await request(app)
      .get("/exercises/Exercise")
      .query({ userId: USER_ONE_ID });

    expect(response.status).toBe(200);
  });

  it("should return JSEND on success with matching exercises", async () => {
    const response = await request(app)
      .get("/exercises/Exercise")
      .query({ userId: USER_ONE_ID });

    expect(response.body).toHaveProperty("status", "success");

    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should return empty array when no exercises match", async () => {
    const response = await request(app)
      .get("/exercises/NonExistentExerciseName")
      .query({ userId: USER_ONE_ID });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });

  it("can paginate results", async () => {
    const response = await request(app)
      .get("/exercises/Exercise")
      .query({ userId: USER_ONE_ID, page: 1, limit: 2 });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);
  });
});
