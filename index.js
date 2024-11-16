import "dotenv/config";

// Import the Google Cloud client library
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { writeFile as _writeFile, readFileSync } from "fs";
import { promisify } from "util";

// Creates a client
const client = new TextToSpeechClient();

async function synthesizeSpeech(text, outputFile) {
  // Construct the request
  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: {
      languageCode: "ja-JP",
      name: "ja-JP-Neural2-D",
    },
    // Select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" },
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);

  // Write the binary audio content to a local file
  const writeFile = promisify(_writeFile);
  await writeFile(outputFile, response.audioContent, "binary");
  console.log(`Audio content written to file: ${outputFile}`);
}

// Example usage
const id = "001";
const text = readFileSync(`data/${id}.txt`, "utf8");
const outputFile = `output-${id}.mp3`;
synthesizeSpeech(text, outputFile).catch(console.error);
