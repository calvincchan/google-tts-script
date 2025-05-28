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
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';

// Creates a client
const client = new TextToSpeechClient();

async function synthesize(text, outputFile) {
  try {
    // Create a new GoogleAuth instance which reads GOOGLE_APPLICATION_CREDENTIALS env var
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    // Get the access token
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    // Get the project ID
    const projectId = await auth.getProjectId();

    // Prepare the request payload
    const payload = {
      input: {
        markup: text
      },
      voice: {
        languageCode: "ja-JP",
        name: process.env.VOICE_NAME || "ja-JP-Standard-A",
      },
      audioConfig: {
        audioEncoding: "LINEAR16"
      }
    };

    // Make the API call
    const response = await axios({
      method: 'post',
      url: 'https://texttospeech.googleapis.com/v1/text:synthesize',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-User-Project': projectId,
        'Authorization': `Bearer ${accessToken.token}`
      },
      data: payload
    });

    // The API returns base64-encoded audio content
    const audioContent = Buffer.from(response.data.audioContent, 'base64');

    // Write the binary audio content to a file
    writeFileSync(outputFile, audioContent);
    console.log(`Audio content written to file: ${outputFile}`);

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

async function main() {
  console.log(
    "This script will generate an audio file from the txt file in the data/ dir and write to output/ dir."
  );

  // Read file name from command line arguments
  const filename = process.argv[2];
  if (!filename) {
    console.error("Usage: node index.js <filename>");
    process.exit(1);
  }
  // Read script file
  const script = readFileSync(`data/${filename}.txt`, "utf8");
  const outputFile = `output/${process.env.VOICE_NAME}-${filename}.mp3`;
  // Generate audio file
  await synthesize(script, outputFile).catch(console.error);
}

main().catch(console.error);
