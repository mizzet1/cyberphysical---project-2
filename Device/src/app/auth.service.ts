import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { SecureVaultService } from './securevalut.service';
import * as CryptoTS from 'crypto-ts';
const crypto = require('crypto');
import { BinaryUtils } from './binaryUtils';
const data_exchanged = '../src/assets/data_exchanged' 

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class AuthService {
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  static SecureVaultService: any;

  constructor(private http: HttpClient, private secureVaultService: SecureVaultService) {}


//generateM1
generateM1(): string {
  const deviceId = environment.device_id;
  const sessionId = this.generateSessionId();
  // Body data to be sent in the POST request
  const M1 = {
    deviceId: deviceId, 
    sessionId: sessionId,
    duration : 2000
  };
  return JSON.stringify(M1);
}

sendM1(m1: string): Observable<any>{
  const body = m1;
  console.log("CLIENT: Sending message M1: ", body);
  return this.http.post('http://localhost:3000/auth/m1', body, {headers: this.headers});
}

//generateSessionId
generateSessionId(){
  const sessionId = Math.floor(Math.random() * 1000).toString();
  localStorage.setItem('sessionId', sessionId);
  return sessionId;
}
 
// //generateKey k1
generateK1(indices: number[]) {
  const vault = this.secureVaultService.getVault();
  
  console.log("Obj keys: ", Object.keys(vault)); // Logs all the keys in the vault object
  console.log("indices ", indices); // XOR all keys at the given indices

  
  const values = indices.map((index) => {
    index++;
    const key = vault[index.toString()];
    console.log("key:", key);

    return key;
    //return BinaryUtils.Hex_to256BitBinary(key);
  });
  console.log("values: ", values);

  const values2 = values.reduce((acc, key) => (BinaryUtils.xorHexStrings(acc, key))); // 256 bits
  return values2;
}


// generateT1
generateT1(): string{
  // Generate a random 256-bit (64-character) hexadecimal string
  const t1 = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  localStorage.setItem('t1', t1);
  return t1;
}

//generateC2
generateC2(): number[] {
  const c2: number[] = [];
  // Generates p, a random number from 2 and 7 (i.e. at least 2 keys, at most 7 (n-1) keys). 
  // p determines the number of keys indeces for C2
  const p: number = Math.floor(Math.random() * 6) + 2; 

  const indeces = [0,1,2,3,4,5,6,7];
  for (let i = 0; i < p; i++) {
    const current_index = Math.floor(Math.random() * indeces.length)  
    c2.push(indeces[current_index]);
    indeces.splice(current_index,1); 
  }
  localStorage.setItem('C2', JSON.stringify(c2));
  return c2;
}

//generateR2
generateR2(): string { 
  // Generate a random 64-bit (16-character) hexadecimal string
  const hex = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return hex;
}
//generateM3
generateM3(r1: string, c1: number[]): string {
  const t1 = this.generateT1();
  console.log("t1: ", t1);
  const c2 = this.generateC2();
  console.log("c2: ", c2);
  const r2 = this.generateR2();
  console.log("r2: ", r2);
  const k1 = this.generateK1(c1); //key k1 generated by C1 indeces
  console.log("k1: ", k1);

  const m3_json = 
  {
    r1: r1,
    t1: t1,
    C2: c2,
    r2: r2
  };
  //const m3_string = m3_json.toString();
  console.log("CLIENT: \nGenerating M3 ... \nM3: ", JSON.stringify(m3_json).toString());
  const M3_encrypted = CryptoTS.AES.encrypt(JSON.stringify(m3_json), k1);
  return JSON.stringify(M3_encrypted);

}

//sendM3
sendM3(r1: string, c1: number[]): Observable<any> {
  const body = this.generateM3(r1, c1);
  console.log("CLIENT: \nSending message M3 Encrypted: ", body);
  return this.http.post('http://localhost:3000/auth/m3', body, {headers: this.headers});
}

decryptM4(m4: string): any {
  const C2 = JSON.parse(localStorage.getItem('C2')!);
  const k2 = this.generateK1(C2);
  const t1 = localStorage.getItem('t1')!; 
  //XOR t1 and k2
  const k2_t1 = BinaryUtils.xorHexStrings(k2, t1);//[k2, t1].reduce((acc, key) => (BigInt(`0x${acc}`) ^ BigInt(`0x${key}`)).toString(16), '0');

  console.log("k2_t1: ", k2_t1);

  var bytes = CryptoTS.AES.decrypt(m4, k2_t1).toString(CryptoTS.enc.Utf8);
  console.log("CLIENT: \n bytes M4: " + bytes);

  var m4_json = JSON.parse(bytes);
  console.log("CLIENT: \nDecrypted M4: ", bytes);

  return m4_json;
}

generateT(t1: string, t2: string): void{
  const T = BinaryUtils.xorHexStrings(t1, t2);
  console.log("T - Session Key Generated: ", T);
  //Here we assume that T is stored in a secure database
}


changeSecureVault(): void {
  console.log("Changing Secure Vault");
  const new_vault : { [key: string]: string } = {};

  //get vault
  const currentVault = JSON.stringify(this.secureVaultService.getVault());
  //get messages
  const dataExchanged = JSON.stringify(data_exchanged);
  //Compute H
  const h = crypto.createHmac('sha256', dataExchanged).update(currentVault).digest('hex');
  console.log("H: ", h);
  //split current secure vault into j equal partitions
  // since secure_vault.size = 1024 bits, k = 256 bits ==> j = 1024/256 = 8
  var p = this.secureVaultService.getVault()

  // generate new secure vault with j partitions Pi XOR (h XOR i) , where i is the index of the partition
  Object.keys(p).forEach((key, i) => {
    const h_bin = BinaryUtils.Hex_to256BitBinary(h);
    const i_bin = BinaryUtils.Number_to256BitBinary(i);
    const h_xor_i = BinaryUtils.xor_BinaryStrings(h_bin, i_bin);

    const partition: string = p[key];
    const partition_bin = BinaryUtils.Hex_to256BitBinary(partition);

    const result_i_bin = BinaryUtils.xor_BinaryStrings(partition_bin, h_xor_i);
    const result_i = BinaryUtils.binary_ToHex(result_i_bin);

    new_vault[key] = result_i;
  });
  
  this.secureVaultService.setVault(new_vault);
  console.log("Secure Vault changed!" + "\nNew Secure Vault: ", new_vault);

  // h  XOR i = (256 bit) XOR (256 bit) = 256 bit

  // element XOR (h XOR i) = 128 (to pad) XOR 256 bit = 256 bit

  /**
    * CONVERT SECURE VAULT TO 64 HEX CHARACTERS !!!
   * 1. convert h to binary 256
   * 2 i = convert i to binary 256
   * 3. h_xor_i = XOR h and i (256 bits)
   * 4 convert partition to binary 256
   * 5. partition_xor_h_xor_i = XOR partition and h_xor_i (256 bits)
   * 6. convert partition_xor_h_xor_i to hex (64 characters)
   */

}
}



