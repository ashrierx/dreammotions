import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyze from "./analyze.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/analyze", analyze);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});