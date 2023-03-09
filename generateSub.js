import { spawn } from "child_process";
import sendEmail from "./sendEmail.js";

const generateSub = (res) => {
  const ffmpegPath = "/usr/local/bin/ffmpeg";
  const inputFile1 = "Jenny.wav";
  const inputFile2 = "Sara.wav";
  const waterFile = "water.wav";
  const outputFile = "merged.wav";

  const ffprobeArgs = [
    "-i",
    "water.wav",
    "-show_entries",
    "format=duration",
    "-v",
    "quiet",
    "-of",
    "csv=p=0",
  ];

  const ffprobeProcess = spawn("ffprobe", ffprobeArgs);

  let duration = 0;

  ffprobeProcess.stdout.on("data", (data) => {
    duration = Math.ceil(parseFloat(data.toString()));
  });

  ffprobeProcess.on("exit", (code) => {
    if (code !== 0) {
      console.error(`ffprobe exited with code ${code}`);
    } else {
      console.log(`Water audio duration is ${duration} seconds`);

      const ffmpegArgs = [
        "-stream_loop",
        duration,
        "-i",
        inputFile1,
        "-stream_loop",
        `${duration - 2}`,
        "-i",
        inputFile2,
        "-i",
        waterFile,
        "-filter_complex",
        "[0:a]volume=0.1[a1];[1:a]volume=0.1,adelay=2000[a2];[a1][a2][2:a]amix=inputs=3[aout]",
        "-map",
        "[aout]",
        "-ac",
        "2",
        "-t",
        duration,
        "-f",
        "wav",
        outputFile,
      ];
      const ffmpegProcess = spawn(ffmpegPath, ffmpegArgs);

      ffmpegProcess.on("error", (err) => {
        console.error("An error occurred:", err);
      });

      ffmpegProcess.on("exit", async (code) => {
        if (code !== 0) {
          res.send(`ffmpeg exited with code ${code}`);
        } else {
          sendEmail()
          res.send("Merging complete!");
        }
      });
    }
  });
};

export default generateSub;
