import aws from "aws-sdk";
import fs from "fs";

export const downloadFile = (bucketName, key, downloadPath) => {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;
  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
  });
  const s3 = new aws.S3();
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  return new Promise((resolve, reject) => {
    // Create a writable stream for the file we're going to download to
    const fileStream = fs.createWriteStream(downloadPath);

    // Handling errors and completion of file stream
    fileStream.on("error", (err) => reject(err));

    fileStream.on("finish", () => resolve());

    // Start the download from S3 and pipe it to the file stream
    const s3Stream = s3.getObject(params).createReadStream();

    // Handling errors from the S3 stream
    s3Stream.on("error", (err) => {
      fileStream.end();
      reject(err);
    });

    // Pipe the S3 stream to file stream
    s3Stream.pipe(fileStream);
  });
};
