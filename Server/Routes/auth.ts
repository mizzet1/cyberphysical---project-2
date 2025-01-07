import express from "express";

export const authRouter = express.Router();


authRouter.get("/:m1", async (req: any, res: any) => {
    const deviceId = req?.body?.deviceId;
    const sessionId = req?.body?.sessionId;
    if (checkDeviceId(deviceId)){
        const M2 = generateM2(); // if valid Device ID --> generate message M2
        return res.status(200).json(M2);
    }
    else{
        return res.status(401).send("Invalid Device Id"); // else, return 401 Unauthorized status code
    }
});

//Check if DeviceId of the request is known to server
function checkDeviceId(deviceId: String): boolean {
    const data = require("../devices.json");
    for (const device of data.devices) {
        if (deviceId === device.device_id) {
            return true;
        }
    }
    return false;
}

function generateM2(){
    const r1 = generateR1();
    const C1 = generateC1();
    const M2 = {
        r1: r1,
        C1: C1
    }
    return M2;
}

function generateC1(): number[] {
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

  function generateR1(): number{
    return Math.floor(Math.random() * 1000);
  }

  