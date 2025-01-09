import express from "express";

class authService{

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
    const r1 = authService.generateR1();
    const C1 = authService.generateC1();
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
    return c1;
}

// generateR1
static generateR1(): string{
    // Generate a random 64-bit (16-character) hexadecimal string
    const hex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    return hex;
  }

}