import express from "express";
import {
  leaderboard,
  matchup,
  validateDocumentVersionMetatdataBody,
} from "./controller";
const app = express();

app.use(express.json({ limit: "10kb" }));

app.post("/matchup", validateDocumentVersionMetatdataBody, matchup);
app.get("/leaderboard", leaderboard);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
