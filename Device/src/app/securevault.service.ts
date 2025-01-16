import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SecureVaultService{
  
  private secureVault: { [key: string]: string } ={}
  // Store a new secure vault locally in the service
  setVault(vault: { [key: string]: string }) {
    this.secureVault = vault;
  }

  // Retrieve the secure vault for use
  getVault(): { [key: string]: string } {
    return this.secureVault;
  }

   // Function to write data back to the JSON file and return a promise
  async initializeSecureVault() {
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
    // Use fs.promises.writeFile to write data asynchronously
    await this.setVault(secureVault);
    console.log('Secure Vault initialized successfully!');
    return Promise.resolve(); // Fulfill the promise when the write is successful
  } catch (err) {
    console.error('Error during initialization of secure vault:', err);
    return Promise.reject(err); // Reject the promise if an error occurs
  }
}
}
