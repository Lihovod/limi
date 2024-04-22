import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { generateTrack } from "./utils/generateTrack.js";
import { mergeAudioFiles } from "./utils/mergeAudioFiles.js";
import { downloadFile } from "./utils/downloadFile.js";

dotenv.config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const subSchema = new mongoose.Schema({
  singular: String,
  plural: String,
});

const Sub = mongoose.model("Sub", subSchema);

app.get("/api/merge", async (req, res) => {
  try {
    const id = "66266508446a17b7f19268a0";
    const username = "Lily";
    const sub = await Sub.findById(id);
    const result = sub.singular.replaceAll('{userName}', username);

    const bucketName = "limi-subs";
    const key = "water.wav"; // file name in s3
    const downloadPath = "water.wav"; // where to put the file
    // Wait for the file to download
    await downloadFile(bucketName, key, downloadPath);

    await generateTrack("AvaNeural", result);


    console.log("File downloaded successfully.");
    const file1 = "water.wav";
    const file2 = "AvaNeural.wav";
    const outputFile = "output.wav";
    mergeAudioFiles(file1, file2, outputFile);
  } catch (error) {
    console.error("Error:", error);
  }

  res.status(200).send({ message: "Merged" });
});

app.post("/api/generate-track", async (req, res) => {
  const { voice, text } = req.body;

  console.log(req.body);

  

  res.status(200).send({ message: "Email sent" });
});

const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
