import request from "supertest";
import express, { Request, Response } from "express";
import { matchup } from "../controller";

const app = express();
app.use(express.json());
app.post("/matchup", matchup);

describe("POST /matchup", () => {
  test("should return a draw when the scores are the same", async () => {
    const response = await request(app)
      .post("/matchup")
      .send({
        player1: { name: "John", score: 10 },
        player2: { name: "Jane", score: 10 },
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("Success");
    expect(response.body.winner).toEqual("This is a draw");
  });

  test("should return the correct winner when the scores are different", async () => {
    const response = await request(app)
      .post("/matchup")
      .send({
        player1: { name: "John", score: 15 },
        player2: { name: "Jane", score: 10 },
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("Success");
    expect(response.body.winner).toEqual("John wins");
  });

  test("should return the correct winner when player2 has a higher score", async () => {
    const response = await request(app)
      .post("/matchup")
      .send({
        player1: { name: "John", score: 5 },
        player2: { name: "Jane", score: 10 },
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("Success");
    expect(response.body.winner).toEqual("Jane wins");
  });
});
