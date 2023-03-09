import nodemailer from "nodemailer";
import fs from "fs";

const sendEmail = async (res) => {
  // Define the file paths

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lilly.liho@gmail.com",
      pass: "ixlxbqmhbblpsjba",
    },
  });

  const fileData = fs.readFileSync('./merged.wav');

  console.log(fileData);

  // Create the mail options
  const mailOptions = {
    from: "your_email@example.com",
    to: "lilly.liho@gmail.com",
    subject: "Email subject",
    text: "Email body",
    attachments: [
      {
        filename: "output.wav",
        content: fileData,
      },
    ],
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      res.send("Email sent: " + info.response);
    }
  });
};

export default sendEmail;
