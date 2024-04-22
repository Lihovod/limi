import ffmpeg from "fluent-ffmpeg";

export const mergeAudioFiles = (file1, file2, outputFile) => {
  // Create an ffmpeg command
  const command = ffmpeg();

  // Add the first audio file
  command.addInput(file1);

  // Add the second audio file with an option to loop it until the longest file ends
  command.input(file2).inputOptions([
    "-stream_loop -1", // Loop the input indefinitely (ffmpeg will cut it off when the longest input ends)
  ]);

  // Configure audio filters to merge the tracks
  command.complexFilter([
    "[0:a][1:a]amerge=inputs=2[a]", // Merge the two audio inputs
  ]);

  // Map the merged audio to the output
  command.outputOptions([
    "-map [a]", // Map the audio from the complex filter
  ]);

  // Set the output file and format
  command
    .output(outputFile)
    .audioCodec("libmp3lame") // Using MP3 codec; adjust as necessary for other formats
    .on("error", function (err) {
      console.error("An error occurred: " + err.message);
    })
    .on("end", function () {
      console.log("Merging finished !");
    })
    .run();
};
