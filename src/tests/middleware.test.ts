import supertest from "supertest";
import express from "express";
import { validateDocumentVersionMetatdataBody } from "../controller"; // Adjust the import according to your file structure

const app = express();
app.use(express.json());

// Dummy route for testing the middleware
app.post(
  "/test-middleware",
  validateDocumentVersionMetatdataBody,
  (req, res) => {
    res.status(200).json({ status: "OK" });
  }
);

const request = supertest(app);

describe("validateDocumentVersionMetatdataBody middleware", () => {
  describe("should return 400 if input is invalid", () => {
    const body = {
      player1: {
        name: "John Doe",
        score: 5,
      },
      player2: {
        name: "Jane Doe",
        score: 5,
      },
    };

    test("Player 1 score missing", async () => {
      const response = await request
        .post("/test-middleware")
        .send({ ...body, player1: { name: body.player1.name } });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("Error");
      expect(response.body.message).toBe('"player1.score" is required');
    });

    test("Player 1 name missing", async () => {
      const response = await request
        .post("/test-middleware")
        .send({ ...body, player1: { score: body.player1.score } });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("Error");
      expect(response.body.message).toBe('"player1.name" is required');
    });

    test("Player 2 score missing", async () => {
      const response = await request
        .post("/test-middleware")
        .send({ ...body, player2: { name: body.player2.name } });
      expect(response.status).toBe(400);
      expect(response.body.status).toBe("Error");
      expect(response.body.message).toBe('"player2.score" is required');
    });

    test("Player 2 name missing", async () => {
      const response = await request
        .post("/test-middleware")
        .send({ ...body, player2: { score: body.player2.score } });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("Error");
      expect(response.body.message).toBe('"player2.name" is required');
    });
  });

  test("should return 200 if input is valid", async () => {
    const validBody = {
      player1: {
        name: "John Doe",
        score: 10,
      },
      player2: {
        name: "Jane Doe",
        score: 5,
      },
    };

    const response = await request.post("/test-middleware").send(validBody);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("OK");
  });
});
