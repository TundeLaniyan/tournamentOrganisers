import request from "supertest";
import express from "express";
import { leaderboard } from "../controller";
import sqlite3 from "sqlite3";
import { Database } from "sqlite3";

const app = express();
app.use(express.json());
app.get("/api/leaderboard", leaderboard);

// Mock the SQLite database
jest.mock("sqlite3", () => {
  const mDatabase: Partial<Database> = {
    all: jest.fn(),
    serialize: jest.fn(),
  };
  return {
    verbose: jest.fn(() => ({
      Database: jest.fn(() => mDatabase),
    })),
  };
});

const mockedSqlite3: any = sqlite3;

describe("GET /api/leaderboard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return leaderboard data", async () => {
    const leaderboardData = [
      { name: "Alice", played: 5, wins: 3, draws: 1 },
      { name: "Bob", played: 5, wins: 2, draws: 2 },
    ];

    mockedSqlite3
      .verbose()
      .Database()
      .all.mockImplementation(
        (_sql: string, callback: (err: Error | null, rows: any[]) => void) => {
          callback(null, leaderboardData);
        }
      );

    const response = await request(app).get("/api/leaderboard");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "Success",
      rows: leaderboardData,
    });

    expect(mockedSqlite3.verbose().Database().all).toHaveBeenCalledTimes(1);
  });

  it("should return a 500 error when the database query fails", async () => {
    const errorMessage = "Database error";

    mockedSqlite3
      .verbose()
      .Database()
      .all.mockImplementation(
        (_sql: string, callback: (err: Error | null, rows: any[]) => void) => {
          callback(new Error(errorMessage), []);
        }
      );

    const response = await request(app).get("/api/leaderboard");
    expect(response.status).toBe(500);
    expect(response.text).toBe(errorMessage);
    expect(mockedSqlite3.verbose().Database().all).toHaveBeenCalledTimes(1);
  });
});
