import { Request, Response } from "express";
import joi from "joi";
import db from "./db";

type Player = { name: string; score: number };
type reqBody = { player1: Player; player2: Player };

const updatePlayer = (
  player: string,
  played: number,
  wins: number,
  draws: number
) => {
  db.run(
    "INSERT OR IGNORE INTO players (name, played, wins, draws) VALUES (?, 0, 0, 0)",
    player,
    (err) => {
      if (err) return console.error(err.message);

      db.run(
        "UPDATE players SET played = played + ?, wins = wins + ?, draws = draws + ? WHERE name = ?",
        [played, wins, draws, player],
        (err) => {
          if (err) return console.error(err.message);
        }
      );
    }
  );
};

export const validateDocumentVersionMetatdataBody = (req, res, next) => {
  const documentVersionSchema = joi.object({
    player1: joi.object({
      name: joi.string().required(),
      score: joi.number().required(),
    }),
    player2: joi.object({
      name: joi.string().required(),
      score: joi.number().required(),
    }),
  });

  const { error } = documentVersionSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const message =
      error?.message || "there was an error validating request body";

    console.error(`[validateDocumentVersionMetatdataBody] ${message}`);
    return res.status(400).json({
      status: "Error",
      message,
    });
  }

  console.info(
    "[validateDocumentVersionMetatdataBody] Successfully validated document version event body"
  );
  next();
};

export const leaderboard = (req: Request, res: Response) => {
  db.all(
    "SELECT name, played, wins, draws FROM players ORDER BY (wins * 3 + draws) DESC, played ASC",
    (err, rows) => {
      if (err) res.status(500).send(err.message);
      else res.status(200).json({ status: "Success", rows });
    }
  );
};

export const matchup = (req: Request, res: Response) => {
  const { player1, player2 }: reqBody = req.body;
  let winner: string;

  if (player1.score == player2.score) {
    updatePlayer(player1.name, 1, 0, 1);
    updatePlayer(player2.name, 1, 0, 1);
    winner = "This is a draw";
  } else if (player1.score > player2.score) {
    updatePlayer(player1.name, 1, 1, 0);
    updatePlayer(player2.name, 1, 0, 0);
    winner = `${player1.name} wins`;
  } else {
    updatePlayer(player1.name, 1, 0, 0);
    updatePlayer(player2.name, 1, 1, 0);
    winner = `${player2.name} wins`;
  }

  res.status(200).json({ status: "Success", winner });
};
