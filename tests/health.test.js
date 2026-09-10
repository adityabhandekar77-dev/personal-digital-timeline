const request = require("supertest");
const app = require("../app");

test("GET / returns API message", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Personal Digital Timeline API");
});