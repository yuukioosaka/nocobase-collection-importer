// Import required libraries
const axios = require('axios');
const fs = require('fs/promises'); // File system operations (Promise version)
const path = require('path');       // Path operations

// --- Settings ---
const API_URL = 'http://localhost:13000/api/collections:create';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGVOYW1lIjoiYWRtaW4iLCJpYXQiOjE3NTMwMDY4NjIsImV4cCI6MzMzMTA2MDY4NjJ9.LhR1Kn0YhvrNNqpfsf_3BgCgUzWALoa8p9uGOJR2npU';
const DEFINITIONS_DIR = path.join(__dirname, 'definitions'); // Absolute path to 'definitions' folder
// --- End of settings ---

/**
 * Function to create a single collection in Nocobase
 * @param {object} payload JSON object of the collection definition
 * @param {string} filename Name of the file being processed (for logging)
 */
async function createCollection(payload, filename) {
  console.log(`\n--- Starting processing of [${filename}] ---`);
  try {
    await axios.post(
      API_URL,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${JWT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    // Success log
    console.log(`✅ SUCCESS: Collection '${payload.name}' was created successfully.`);
  } catch (error) {
    // Error log
    let errorMessage = error.message;
    if (error.response && error.response.data && error.response.data.errors) {
      // Get specific error messages from Nocobase
      errorMessage = error.response.data.errors.map(e => e.message).join(', ');
    }
    console.error(`❌ ERROR: Failed to create collection '${payload.name}'. Reason: ${errorMessage}`);
  }
}

/**
 * Main process: Read the definitions folder and process all files
 */
async function main() {
  console.log('Starting batch creation of Nocobase collections...');
  console.log(`Definitions folder: ${DEFINITIONS_DIR}`);

  try {
    // 1. Get the list of files in the definitions folder
    const files = await fs.readdir(DEFINITIONS_DIR);
    
    // 2. Filter only .json files and sort by filename
    const jsonFiles = files
      .filter(file => path.extname(file).toLowerCase() === '.json')
      .sort(); // Sort filenames alphabetically (dictionary order)

    if (jsonFiles.length === 0) {
      console.warn('No JSON files found in the definitions folder.');
      return;
    }

    console.log(`Found definition files: ${jsonFiles.length}`);
    console.log('Processing in the following order:', jsonFiles);

    // 3. Process each JSON file in order
    for (const file of jsonFiles) {
      const filePath = path.join(DEFINITIONS_DIR, file);
      try {
        // Read the file and parse as JSON
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const payload = JSON.parse(fileContent);
        // Call the collection creation function
        await createCollection(payload, file);
      } catch (parseError) {
        console.error(`\n--- Error occurred while processing [${file}] ---`);
        console.error(`❌ ERROR: Failed to read file or parse JSON. Please check the contents. : ${parseError.message}`);
      }
    }

  } catch (dirError) {
    console.error(`Failed to read the definitions folder. Please check if the folder exists. : ${dirError.message}`);
  }

  console.log('\nAll processing is complete.');
}

// Execute main function
main();