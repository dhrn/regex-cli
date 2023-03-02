const fs = require('fs');
const path = require('path');
const readline = require('readline');

const regex = /api.a.b/g; // Replace YOUR_REGEX_HERE with your regular expression
const directory = './'; // Replace ./ with the directory you want to search in

// Create readline interface to prompt user to continue after each file is processed
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Recursively process all files in directory
async function processFiles(directory) {
  const files = await fs.promises.readdir(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      await processFiles(filePath);
    } else {
      await processFile(filePath);
    }
  }
}

// Process a single file
async function processFile(filePath) {
  console.log(`Processing file: ${filePath}`);
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  let lineNumber = 1;
  for await (const line of stream) {
    if (regex.test(line)) {
      console.log(`Match found in file ${filePath} on line ${lineNumber}: ${line}`);
    }
    lineNumber++;
  }
  stream.close();
  await new Promise(resolve => rl.question('Press enter to continue...', resolve));
}

// Start processing files
processFiles(directory)
  .then(() => console.log('Finished processing all files'))
  .catch(error => console.error(error));
