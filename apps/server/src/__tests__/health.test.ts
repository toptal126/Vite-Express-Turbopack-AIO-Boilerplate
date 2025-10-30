import request from "supertest";
import app from "../index";

describe("Health Endpoint", () => {
  it("should return health status", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("healthy");
    expect(response.body.data.timestamp).toBeDefined();
    expect(response.body.data.uptime).toBeDefined();
  });
});
