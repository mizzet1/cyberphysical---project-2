const fs = require('fs');
const path = require("path");
export class SecureVaultService{

// File path of the JSON file
private static filePath: string = '../secure_vault.json';

// Function to read and parse the JSON file
static getData() {
  try {
    // Use fs.readFileSync to read data synchronously from the file
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
    // Use fs.writeFileSync to write data synchronously to the file
    fs.writeFileSync(path.resolve(__dirname, this.filePath), dataToWrite, "utf-8"); // Write the updated data back to the file
    
  } catch (err) {
    console.error('Error writing to the file:', err);
  }
  console.log('File updated successfully');
}

 // Function to write data back to the JSON file and return a promise
 static async initializeSecureVault() {
  const secureVault: { [key: string]: string } = 
  {
    "1": "7681F837D840F13A37EB1AABCACD1EF94B300776E1BC62FB53118E50241C100E",
    "2": "8FBBA414C20824F42EE403CCF093870D881A46915A2131C09C48E46B89C78556",
    "3": "C7A2D2AF97682B4EC8BCEAA332877690D8ABFEE3A923A944BDF5028A4D0E4D47",
    "4": "97D2C894BF8D0EC96878D5CD269ACE031071F306D917BC6D1B544DBBA1020F76",
    "5": "C1889BAEE5F6E46723B83E6B73DC2B52839ECD5296AAFFC2DA722EF214FCC0D1",
    "6": "2896CC49D32484F5B7DB159225E0917FB7E6DC5209B451AB08E18A85FBDCE376",
    "7": "24C20223C078F0AE4F5A9CA1708683F736833A7474BA0A743B35551A3B65469B",
    "8": "CC3E397CFE1B219C9DEEEB26A4A66E89015A29B3D8473AB44D418E49054A1774"
  }
  try {
    const dataToWrite = JSON.stringify(secureVault, null, 2); // Convert object back to JSON
    // Use fs.promises.writeFile to write data asynchronously
    await fs.promises.writeFile(path.resolve(__dirname, this.filePath), dataToWrite, "utf-8");
    console.log('Secure Vault initialized successfully!');
    return Promise.resolve(); // Fulfill the promise when the write is successful
  } catch (err) {
    console.error('Error during initialization of secure vault:', err);
    return Promise.reject(err); // Reject the promise if an error occurs
  }
}

}