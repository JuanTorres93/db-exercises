import request from "supertest";

export function requestWithAPIHeader(app: any) {
  const apiKey = process.env.API_KEY || "";
  const agent = request(app);

  return {
    get: (url: string) => agent.get(url).set("x-api-key", apiKey),
    post: (url: string) => agent.post(url).set("x-api-key", apiKey),
    put: (url: string) => agent.put(url).set("x-api-key", apiKey),
    patch: (url: string) => agent.patch(url).set("x-api-key", apiKey),
    delete: (url: string) => agent.delete(url).set("x-api-key", apiKey),
  };
}
