/**
 * This script will generate a mp3 audio file from the SSML file in data/ and write to output/.
 *
 * Usage: node index.js <filename>
 *
 * Example: node index.js sample
 * The above command will generate an audio file from the data/sample.ssml file and write to output/sample.mp3
 */

import "dotenv/config";

// Import the Google Cloud client library
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { readFileSync, writeFileSync } from "fs";

// Creates a client
const client = new TextToSpeechClient();

async function synthesizeSpeech(ssml, outputFile) {
  // Construct the request
  const request = {
    input: { ssml: ssml },
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
  writeFileSync(outputFile, response.audioContent, "binary");
  console.log(`Audio content written to file: ${outputFile}`);
}

async function main() {
  console.log(
    "This script will generate an audio file from the SSML file in the data/ dir and write to output/ dir."
  );

  // Read file name from command line arguments
  const filename = process.argv[2];
  if (!filename) {
    console.error("Usage: node index.js <filename>");
    process.exit(1);
  }
  // Read SSML file
  const ssml = readFileSync(`data/${filename}.ssml`, "utf8");
  const outputFile = `output/${filename}.mp3`;
  // Generate audio file
  await synthesizeSpeech(ssml, outputFile).catch(console.error);
}

main().catch(console.error);
