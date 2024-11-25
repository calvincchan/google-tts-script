# Google TTS Project

This project utilizes Google Text-to-Speech (TTS) API to convert SSML formatted text into natural-sounding speech.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Installation

1. Clone the repository:

```sh
git clone https://github.com/calvincchan/google-tts.git
```

2. Navigate to the project directory:

```sh
cd google-tts
```

3. Install the required dependencies:

```sh
yarn install
```

## Usage

1. Set up your Google Cloud service account credentials:

- Copy the `credentials.json` file into `secret/` directory.

- Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable in `.env` file. For example:

```filename=".env"
GOOGLE_APPLICATION_CREDENTIALS=secret/credentials.json
```

2. Put the SSML formatted text you want to convert into a file in the `data/` directory.

3. Run the script:

```sh
node index.js <filename>
```

Eample:

```sh
node index.js data/sample.ssml
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
