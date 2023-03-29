import sqlite3 from "sqlite3";
const sqlite3client = sqlite3.verbose();

const db = new sqlite3client.Database(":memory:", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the in memory SQLite database.");
});

db.serialize(() => {
  db.run(
    "CREATE TABLE players (name TEXT UNIQUE, played INTEGER, wins INTEGER, draws INTEGER)"
  );
});

export default db;
