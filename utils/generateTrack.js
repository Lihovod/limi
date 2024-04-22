import sdk from "microsoft-cognitiveservices-speech-sdk";

export const generateTrack = (voice, text) => {
  const { AZURE_SERVICE_REGION, AZURE_SUBSCRIPTION_KEY } = process.env;

  if (AZURE_SERVICE_REGION && AZURE_SUBSCRIPTION_KEY) {
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(voice + ".wav");
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      AZURE_SUBSCRIPTION_KEY,
      AZURE_SERVICE_REGION
    );

    const ssml = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="en-US-${voice}"><prosody rate="+200.00%" volume="-10.00%">${text}</prosody></voice></speak>`;
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        synthesizer.close();
      },
      (error) => {
        console.log(error);

        synthesizer.close();
      }
    );
  }
};
