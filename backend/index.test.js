// app.test.js
const request = require('supertest');
const app = require('./src/index');

describe("API endpoint tests", () => {
    let sampleTea = { name: "Green Tea", description: "Fresh", levelOfSpicy: "Low" };
    let savedTea;

    beforeAll(async () => {
        const response = await request(app)
            .post("/teas/create")
            .send({ name: "Green Tea", description: "Fresh", levelOfSpicy: "Low" });
        savedTea = response.body; // Ensure this response actually contains the tea data
    });


    // Test Get All Teas
    describe("GET /teas/all", () => {
        it("should return all teas", async () => {
            const response = await request(app).get("/teas/all");
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    // Test Get Tea by ID
    describe("GET /teas/:id", () => {
        it("should return a tea by id", async () => {
            const response = await request(app).get(`/teas/${savedTea.id}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("id", savedTea.id);
        });

        it("should return 404 if tea is not found", async () => {
            const response = await request(app).get("/teas/unknown-id");
            expect(response.statusCode).toBe(404);
        });
    });

    // Test Create Tea
    describe("POST /teas/create", () => {
        it("should create a new tea", async () => {
            const response = await request(app)
                .post("/teas/create")
                .send(sampleTea);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty("id");
            savedTea = response.body;  // Save this tea for other tests
        });

        it("should return the created tea object", async () => {
            const response = await request(app)
                .post("/teas/create")
                .send(sampleTea);
            expect(response.body).toHaveProperty("name", "Green Tea");
        });
    });

    // Test Update Tea
    describe("PATCH /teas/:id", () => {
        it("should update the tea details", async () => {
            const updates = { name: "Updated Green Tea" };
            const response = await request(app)
                .patch(`/teas/${savedTea.id}`)
                .send(updates);
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe("Updated Green Tea");
        });

        it("should return 404 when the tea does not exist", async () => {
            const response = await request(app)
                .patch("/teas/unknown-id")
                .send({ name: "No Tea" });
            expect(response.statusCode).toBe(404);
        });
    });

    // Test Delete Tea
    beforeEach(async () => {
        const postResponse = await request(app)
            .post("/teas/create")
            .send({ name: "Black Tea", description: "Robust flavor", levelOfSpicy: "None" });
        savedTea = postResponse.body; // Save the tea
    });
    describe("DELETE /teas/:id", () => {

        it("should return 404 if the tea to delete does not exist", async () => {
            const response = await request(app).delete(`/teas/unknown-id`);
            expect(response.statusCode).toBe(404);
        });
    });
});
