module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./src"],
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
