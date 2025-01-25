import { SecureVaultService } from './secureVaultService';
import * as CryptoTS from 'crypto-ts';
import {cache} from "../index";
const fs = require('fs');
const crypto = require('crypto');
import { BinaryUtils } from './binaryUtils';
import * as CryptoJS from 'crypto-js';

export class AuthService{

static checkDeviceId(device_id: string, session_id: string): boolean {
    const data = require("../devices.json");
    let found: boolean = false;
    data.devices.forEach((device: any)=>{
      if (device_id == device.device_id.toString()) {
        found = true;
        //save session_id of the device
        device['session_id'] = session_id;
      } 
    });
    return found;
}

static generateM2(){
    const r1 = this.generateR1();
    const C1 = this.generateC1();
    const M2 = {
        r1: r1,
        C1: C1
    }
    return JSON.stringify(M2);
}

static generateC1(): number[] {
    const c1: number[] = [];
    // Generates p, a random number from 2 and 7 (i.e. at least 2 keys, at most 7 (n-1) keys). 
    // p determines the number of keys indeces for C1
    const p: number = Math.floor(Math.random() * 6) + 2; 

    const indeces = [0,1,2,3,4,5,6,7];
    // Randomly select p indeces from the array indeces
    for (let i = 0; i < p; i++) {
      const current_index = Math.floor(Math.random() * indeces.length)  
      c1.push(indeces[current_index]);
      indeces.splice(current_index,1); 
    }
    cache['C1'] = c1 ;
    return c1;
}
// Generate a random 256-bit (64-character) hexadecimal string
static generateR1(): string{
  // Generate a random 256-bit (64-character) hexadecimal string
    const r1 = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    cache['r1'] = r1;
    return r1;
}

static generateKey(indices: number[]) {
  const vault = SecureVaultService.getData();

  const values = indices.map((index) => {
    index++;
    const key = vault[index.toString()];
    return key;
  });
  // XOR all the keys together to generate a single 256-bit key
  const values2 = values.reduce((acc, key) => (BinaryUtils.xorHexStrings(acc, key))); // 256 bits
  return values2;
}


static decryptM3(m3: any): any {

  const C1 = cache['C1'];
  const k1 = this.generateKey(C1);
  console.log("k1:" + k1);

  var bytes = CryptoTS.AES.decrypt(m3, k1);
  console.log("bytes ", bytes);

  var m3_string = CryptoTS.enc.Utf8.stringify(bytes);
  console.log("m3_string ", m3_string);

  var m3_json = JSON.parse(m3_string);
  console.log("m3_json ", m3_json);

  return m3_json;
}

static generateT2(): string{
  // Generate a random 256-bit (64-character) hexadecimal string
  const hex = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return hex;
}

static generateM4(decryptedM3: any): any {
  //generate k2 (through C2)
  const k2 = this.generateKey(decryptedM3.C2);
  //receive t1
  const t1 = decryptedM3.t1;
  //receive r2
  const r2 = decryptedM3.r2;
  //generate t2
  const t2 = this.generateT2();

  // XOR k2 and t1
  const k2_t1 = BinaryUtils.xorHexStrings(k2, t1);
  console.log("k2: " + k2 + "\n" + "t1: " + t1 + "\n" 
    + "k2_XOR_t1: ", k2_t1 + "\n" + "t2: ", t2 );

  // Concatenate r2 and t2
  const m4_payload = JSON.stringify({
    r2: r2,
    t2: t2
  });

  //Generate Session Key T
  this.generateT(t1, t2);

  // Generate M4 enctrypted
  const M4_encrypted = CryptoTS.AES.encrypt(m4_payload, k2_t1).toString();
  return M4_encrypted;
}

static generateT(t1: string, t2: string): void {
  const T = BinaryUtils.xorHexStrings(t1, t2);
  console.log("T - Session Key Generated: ", T);
  //Here we assume that T is stored in a secure database
}

//Retrieve the data exchanged during communication
static getDataExchanged(): any {
  try {
    const path = require("path");
    // Use fs.readFileSync to read data synchronously from the file
    const rawData = fs.readFileSync(path.resolve(__dirname, '../data_exchanged.json'), "utf-8");
    return JSON.parse(rawData); 
  } catch (err) {
    console.error('Error reading the file:', err);
    return null;
  }
}



static changeSecureVault(): void {
  const new_vault : { [key: string]: string } = {};

  //get vault
  const currentVault = JSON.stringify(SecureVaultService.getData());
  //get messages
  const dataExchanged = JSON.stringify(this.getDataExchanged());
  console.log("current vault ", currentVault);
  console.log("data exch: ", dataExchanged);
  //Compute H
  //const h = crypto.createHmac('sha256', dataExchanged).update(currentVault).digest('hex');
  const h = CryptoJS.HmacSHA256(currentVault, dataExchanged).toString(CryptoJS.enc.Hex);  
  console.log("H: ", h);
  //split current secure vault into j equal partitions
  // since secure_vault.size = 1024 bits, k = 256 bits ==> j = 1024/256 = 8
  var p = SecureVaultService.getData();

  // generate new secure vault with j partitions Pi XOR (h XOR i) , where i is the index of the partition
  /**
  * 1. convert h to binary 256 bits
  * 2. convert i to binary 256 bits
  * 3. h_xor_i = XOR h and i (256 bits)
  * 4. convert partition to binary 256 bits
  * 5. partition_xor_h_xor_i =  partition XOR h_xor_i (256 bits)
  * 6. convert partition_xor_h_xor_i to hex (64 characters)
  */
  // h  XOR i = (256 bit) XOR (256 bit) = 256 bit
  // partition XOR (h XOR i) = (256 bit) XOR (256 bit) = 256 bit
  Object.keys(p).forEach((key, i) => {
    const h_bin = BinaryUtils.Hex_to256BitBinary(h);
    const i_bin = BinaryUtils.Number_to256BitBinary(i);
    const h_xor_i = BinaryUtils.xor_BinaryStrings(h_bin, i_bin);

    //get partition key and convert it to binary
    const partition: string = p[key];
    const partition_bin = BinaryUtils.Hex_to256BitBinary(partition);

    //compute p XOR (h_xor_i) and convert it to hex
    const result_i_bin = BinaryUtils.xor_BinaryStrings(partition_bin, h_xor_i);
    const result_i = BinaryUtils.binary_ToHex(result_i_bin);

    //save the new value in new_vault
    new_vault[key] = result_i;
  });
  
  //update secure vault
  SecureVaultService.setData(new_vault);
  console.log("Secure Vault changed!" + "\nNew Secure Vault: ", new_vault);

}

}

