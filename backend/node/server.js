import express from "express";
import cors from "cors";
import analyzeRoute from "./routes/analyze.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/analyze", analyzeRoute);

app.listen(5000, () => console.log("Node backend running on port 5000"));