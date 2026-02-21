import express from "express";
import axios from "axios";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    const pythonResponse = await axios.post(
      "http://localhost:8000/predict",
      req.file.buffer,
      {
        headers: { "Content-Type": "application/octet-stream" }
      }
    );

    res.json(pythonResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ML service error" });
  }
});

export default router;