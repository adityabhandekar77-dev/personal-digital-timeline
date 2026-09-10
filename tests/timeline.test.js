const request = require("supertest");
const app = require("../app");
const pool = require("../db");

let token;

beforeAll(async () => {
    await pool.query(
        "DELETE FROM timeline_entries"
    );

    await pool.query(
        "DELETE FROM users WHERE email = $1",
        ["test@example.com"]
    );

    const registerResponse = await request(app)
        .post("/api/auth/register")
        .send({
            email: "test@example.com",
            password: "mySecret123"
        });

    expect(registerResponse.statusCode).toBe(201);

    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email: "test@example.com",
            password: "mySecret123"
        });

    expect(loginResponse.statusCode).toBe(200);

    token = loginResponse.body.token;
});
test("GET /api/timeline without token returns 401", async () => {
    const response = await request(app)
        .get("/api/timeline");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Authentication required");
});

test("GET /api/timeline with valid token returns 200", async () => {
    const response = await request(app)
        .get("/api/timeline")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("pagination");
});

test("POST /api/timeline creates a timeline entry", async () => {
    const response = await request(app)
        .post("/api/timeline")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Automated Test Entry",
            description: "Created by Jest and Supertest",
            type: "learning"
        });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Automated Test Entry");
    expect(response.body.type).toBe("learning");
    expect(response.body).toHaveProperty("id");

    await pool.query(
        "DELETE FROM timeline_entries WHERE id = $1",
        [response.body.id]
    );
});

test("POST /api/timeline rejects an invalid type", async () => {
    const response = await request(app)
        .post("/api/timeline")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Invalid Type Test",
            description: "This should be rejected",
            type: "banana"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid timeline type");
});

test("GET /api/timeline/:id does not expose another user's entry", async () => {
    const userBEmail = `userb_${Date.now()}@example.com`;
    const userBPassword = "testPassword123";

    await request(app)
        .post("/api/auth/register")
        .send({
            email: userBEmail,
            password: userBPassword
        });

    const userBLogin = await request(app)
        .post("/api/auth/login")
        .send({
            email: userBEmail,
            password: userBPassword
        });

    const userBToken = userBLogin.body.token;

    const entryResponse = await request(app)
        .post("/api/timeline")
        .set("Authorization", `Bearer ${userBToken}`)
        .send({
            title: "User B Private Entry",
            description: "This belongs to User B",
            type: "project"
        });

    const entryId = entryResponse.body.id;

    const response = await request(app)
        .get(`/api/timeline/${entryId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Timeline entry not found");

    await pool.query(
        "DELETE FROM timeline_entries WHERE id = $1",
        [entryId]
    );

    await pool.query(
        "DELETE FROM users WHERE email = $1",
        [userBEmail]
    );
});

test("GET /api/timeline/:id returns an existing entry", async () => {
    const createResponse = await request(app)
        .post("/api/timeline")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "GET By ID Test",
            description: "Testing GET by ID",
            type: "milestone"
        });

    const entryId = createResponse.body.id;

    const response = await request(app)
        .get(`/api/timeline/${entryId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(entryId);
    expect(response.body.title).toBe("GET By ID Test");

    await pool.query(
        "DELETE FROM timeline_entries WHERE id = $1",
        [entryId]
    );
});

test("PUT /api/timeline/:id updates an existing entry", async () => {
    const createResponse = await request(app)
        .post("/api/timeline")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "PUT Test",
            description: "Original description",
            type: "project"
        });

    const entryId = createResponse.body.id;

    const response = await request(app)
        .put(`/api/timeline/${entryId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "PUT Test Updated",
            description: "Updated description",
            type: "milestone"
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(entryId);
    expect(response.body.title).toBe("PUT Test Updated");
    expect(response.body.description).toBe("Updated description");
    expect(response.body.type).toBe("milestone");

    await pool.query(
        "DELETE FROM timeline_entries WHERE id = $1",
        [entryId]
    );
});

test("DELETE /api/timeline/:id deletes an existing entry", async () => {
    const createResponse = await request(app)
        .post("/api/timeline")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "DELETE Test",
            description: "Entry to be deleted",
            type: "achievement"
        });

    const entryId = createResponse.body.id;

    const deleteResponse = await request(app)
        .delete(`/api/timeline/${entryId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body.id).toBe(entryId);

    const getResponse = await request(app)
        .get(`/api/timeline/${entryId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(getResponse.statusCode).toBe(404);
});

test("POST /api/auth/login rejects an incorrect password", async () => {
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "test@example.com",
            password: "wrongPassword"
        });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid email or password");
});
test("GET /api/timeline rejects an invalid token", async () => {
    const response = await request(app)
        .get("/api/timeline")
        .set("Authorization", "Bearer definitely-not-a-real-token");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid or expired token");
});
test("POST /api/timeline rejects missing required fields", async () => {
    const response = await request(app)
        .post("/api/timeline")
        .set("Authorization", `Bearer ${token}`)
        .send({
            description: "Missing title",
            type: "learning"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
        "title, description, and type are required"
    );
});

test("GET /api/timeline/:id rejects an invalid ID", async () => {
    const response = await request(app)
        .get("/api/timeline/abc")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("ID must be a valid number");
});

test("GET /api/timeline/:id returns 404 for a nonexistent entry", async () => {
    const response = await request(app)
        .get("/api/timeline/999999999")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Timeline entry not found");
});

test("PUT /api/timeline/:id returns 404 for a nonexistent entry", async () => {
    const response = await request(app)
        .put("/api/timeline/999999999")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Nonexistent Entry",
            description: "This should not update anything",
            type: "project"
        });

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Timeline entry not found");
});

test("DELETE /api/timeline/:id returns 404 for a nonexistent entry", async () => {
    const response = await request(app)
        .delete("/api/timeline/999999999")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Timeline entry not found");
});


test("GET /api/timeline filters entries by type", async () => {
    const response = await request(app)
        .get("/api/timeline?type=learning")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    for (const entry of response.body.data) {
        expect(entry.type).toBe("learning");
    }
});

test("GET /api/timeline sorts entries by newest first", async () => {
    const response = await request(app)
        .get("/api/timeline?sort=newest")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    const entries = response.body.data;

    for (let i = 1; i < entries.length; i++) {
        const previous = new Date(entries[i - 1].created_at);
        const current = new Date(entries[i].created_at);

        expect(previous.getTime()).toBeGreaterThanOrEqual(
            current.getTime()
        );
    }
});

test("GET /api/timeline paginates entries correctly", async () => {
    const response = await request(app)
        .get("/api/timeline?page=1&limit=2")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.pagination.page).toBe(1);
    expect(response.body.pagination.limit).toBe(2);
    expect(response.body.data.length).toBeLessThanOrEqual(2);
    expect(response.body.pagination.totalPages).toBe(
        Math.ceil(response.body.pagination.total / 2)
    );
});

afterAll(async () => {
    await pool.end();
});