import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { generateTrack } from "./utils/generateTrack.js";
import { mergeAudioFiles } from "./utils/mergeAudioFiles.js";
import { downloadFile } from "./utils/downloadFile.js";

dotenv.config();

const app = express();

app.use(express.json());

const mongoURI =
  "mongodb+srv://lihovod:na6na6nA@cluster0.kqonc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB URI

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.get("/api/merge", async (req, res) => {
  try {
    const bucketName = "limi-subs";
    const key = "water.wav"; // file name in s3
    const downloadPath = "water.wav"; // where to put the file

    // Wait for the file to download
    await downloadFile(bucketName, key, downloadPath);
    console.log("File downloaded successfully.");

    const file1 = "water.wav";
    const file2 = "AvaNeural.wav";
    const outputFile = "output_audio.mp3";
    mergeAudioFiles(file1, file2, outputFile);

    // Open the file using fs.promises
  } catch (error) {
    console.error("Error:", error);
  }

  res.status(200).send({ message: "Merged" });
});

app.post("/api/generate-track", (req, res) => {
  const { voice, text } = req.body;

  console.log(req.body);

  generateTrack(voice, text);

  res.status(200).send({ message: "Email sent" });
});

const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
