import express from "express";
import sdk from "microsoft-cognitiveservices-speech-sdk";
import dotenv from "dotenv";
import generateSub from "./generateSub.js";
import sendEmail from "./sendEmail.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/merge", async (req, res) => {
  // generateSub(res);
  await sendEmail(res)
});

app.get("/", (req, res) => {
  const { voice, text } = req.body;

  const { AZURE_SERVICE_REGION, AZURE_SUBSCRIPTION_KEY } = process.env;

  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(voice + ".wav");
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    AZURE_SUBSCRIPTION_KEY,
    AZURE_SERVICE_REGION
  );
  // Jenny whispering
  let ssml;

  if (voice === "Jenny") {
    ssml = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="en-US-JennyNeural"><mstts:express-as style="whispering" ><prosody rate="200%" pitch="0%">${text}</prosody></mstts:express-as></voice></speak>`;
  }

  if (voice === "Sara") {
    ssml = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="en-US-SaraNeural"><mstts:express-as style="whispering" ><prosody rate="200%" pitch="5%">${text}</prosody></mstts:express-as></voice></speak>`;
  }

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  synthesizer.speakSsmlAsync(
    ssml,
    (result) => {
      synthesizer.close();
      res.send(result);
    },
    (error) => {
      console.log(error);
      res.send(error);
      synthesizer.close();
    }
  );
});

const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
