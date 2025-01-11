import { SecureVaultService } from './secureVaultService';
import * as CryptoTS from 'crypto-ts';
import {cache} from "../index";

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
    return M2;
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
    console.log("cache[C1]: ", cache['C1']);
    return c1;
}


static generateR1(): string{
    // Generate a random 64-bit (16-character) hexadecimal string
    const r1 = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    cache['r1'] = r1;
    console.log("cache[r1]: ", cache['r1']);
    return r1;
}

static generateK1(indices: number[]): string {
  const vault = SecureVaultService.getData();
  console.log("vault: ", vault);
  // XOR all keys at the given indices
  return indices
    .map((index) => vault[index.toString()]) // Fetch keys as hex strings
    .reduce((acc, key) => (parseInt(acc, 16) ^ parseInt(key, 16)).toString(16), '0');
}

static decryptM3(m3: string): any {

  const C1 = cache['C1'];
  const k1 = this.generateK1(C1);
  return CryptoTS.AES.decrypt(m3, k1);
}

static generateM4(){
    const m4 = "abc123";
}

}