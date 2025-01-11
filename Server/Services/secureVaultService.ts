const fs = require('fs');

export class SecureVaultService{

// File path of the JSON file
private static filePath: string = '../secure_vault.json';

// Function to read and parse the JSON file
static getData() {
  try {
    const rawData = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(rawData); // Parse the JSON string into an object
  } catch (err) {
    console.error('Error reading the file:', err);
    return null;
  }
}

// Function to write data back to the JSON file
static setData(newData: any) {
  try {
    const dataToWrite = JSON.stringify(newData, null, 2); // Convert object back to JSON
    fs.writeFileSync(this.filePath, dataToWrite, 'utf8'); // Write the updated data back to the file
    console.log('File updated successfully');
  } catch (err) {
    console.error('Error writing to the file:', err);
  }
}


}