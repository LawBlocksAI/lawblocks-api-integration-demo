import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.config.js";
import mainRouter from "./routes/index.js";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

connectDB();

app.use("/", mainRouter);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
