import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Init services:todo

// Create routes:todo

//generic error message:
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ status: "unauthorized", message: err.message });
  } else if (err.name === "DoneDealError") {
    res.status(400).json({ status: "domain error", message: err.message });
  } else {
    res.status(400).json({ status: "application error", message: err.message });
  }
});

app.listen(3000, function () {
  console.log("Server listening on port 3000.");
});
