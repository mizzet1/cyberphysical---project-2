const fs = require('fs');
const path = require("path");
export class SecureVaultService{

// File path of the JSON file
private static filePath: string = '../secure_vault.json';

// Function to read and parse the JSON file
static getData() {
  try {
    const rawData = fs.readFileSync(path.resolve(__dirname, this.filePath), "utf-8");
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
    fs.writeFileSync(path.resolve(__dirname, this.filePath), dataToWrite, "utf-8"); // Write the updated data back to the file
    
  } catch (err) {
    console.error('Error writing to the file:', err);
  }
  console.log('File updated successfully');
}

static updateSecureVault(index: string, value: string) {
  // Get the current data from the JSON file
  const currentData = this.getData();
  // Update the value of the specified index
  currentData[index] = value;
  // Write the updated data back to the JSON file
  this.setData(currentData);
}

}