import { SecureVaultService } from './secureVaultService';
import * as CryptoTS from 'crypto-ts';
import {cache} from "../index";
import { json } from 'express';

export class AuthService{

//Check if DeviceId of the request is known to server
static checkDeviceId(device_id: string, session_id: string): boolean {
    const data = require("../devices.json");
    let found: boolean = false;
    data.devices.forEach((device: any)=>{
      if (device_id == device.device_id.toString()) {
        found = true;
        //save session_id of the device
        device.session_id = session_id;
      } 
    });
    return found;
}

//generate M2
static generateM2(){
    const r1 = this.generateR1();
    const C1 = this.generateC1();
    const M2 = {
        r1: r1,
        C1: C1
    }
    return JSON.stringify(M2);
}

// generateC1
static generateC1(): number[] {
    const c1: number[] = [];
    // Generates p, a random number from 2 and 7 (i.e. at least 2 keys, at most 7 (n-1) keys). 
    // p determines the number of keys indeces for C1
    const p: number = Math.floor(Math.random() * 6) + 2; 

    const indeces = [0,1,2,3,4,5,6,7];
    for (let i = 0; i < p; i++) {
      const current_index = Math.floor(Math.random() * indeces.length)  
      c1.push(indeces[current_index]);
      indeces.splice(current_index,1); 
    }
    cache['C1'] = c1 ;
    return c1;
}

static generateR1(): string{
    // Generate a random 64-bit (16-character) hexadecimal string
    const r1 = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    cache['r1'] = r1;
    return r1;
}

static generateKey(indices: number[]): string {
  const vault = SecureVaultService.getData();
  // XOR all keys at the given indices
  return indices
    .map((index) => vault[index.toString()]) // Fetch keys as hex strings
    .reduce((acc, key) => (parseInt(acc, 16) ^ parseInt(key, 16)).toString(16), '0');
}

static decryptM3(m3: any): any {

  const C1 = cache['C1'];
  console.log(C1);
  const k1 = this.generateKey(C1);
  var bytes = CryptoTS.AES.decrypt(m3, k1);
  var m3_string = CryptoTS.enc.Utf8.stringify(bytes);
  var m3_json = JSON.parse(m3_string);
  return m3_json;
}

static generateT2(): string{
  // Generate a random 64-bit (16-character) hexadecimal string
  const hex = Array.from({ length: 16 }, () =>
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

  // XOR k2 and t1
  const k2_t1 = [k2, t1].reduce((acc, key) => (parseInt(acc, 16) ^ parseInt(key, 16)).toString(16), '0');
  console.log("k2: " + k2 + "\n" + "t1: " + t1);
  console.log("k2_t1: ", k2_t1);

  // Concatenate r2 and t2
  const t2 = this.generateT2();
  const r2_t2 = r2 + t2;

  //Generate T: Session key
  this.generateT(t1, t2);

  // Generate M4 enctrypted
  const M4_encrypted = CryptoTS.AES.encrypt(r2_t2, k2_t1);
  return JSON.stringify(M4_encrypted);
}

static generateT(t1: string, t2: string): string {
  const T = [t1, t2].reduce((acc, key) => (parseInt(acc, 16) ^ parseInt(key, 16)).toString(16), '0');
  console.log("T - Session Key Generated: ", T);
  return T;
  //Here we assume that T is stored in a secure database
}

}
