import express from "express";
import { cache } from "../index";
import { AuthService } from "../Services/authService";

export const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post("/m1", async (req: any, res: any) => {

  console.log("SERVER: Device Authentication request \n Client Message M1: ", req.body);
  const M1 = req.body;
  const deviceId = M1.deviceId;
  const sessionId = M1.sessionId;
  const duration = M1.duration;

  // Check if the request body contains the required fields
  if (!deviceId || !sessionId) {
    return res.status(400).json({ error: 'Missing deviceId or sessionId' });
  }

  // Check if the Device ID is known to the server
  if (AuthService.checkDeviceId(deviceId, sessionId)){
    // generate M2
    const M2 = AuthService.generateM2(); // if valid Device ID --> generate message M2
    const M2_response = {
      message: 'Message M1 received! Sending Message M2 ...',
      M2: M2
    }
    console.log("SERVER: DeviceID valid\nSending Message M2 ..." + "\nM2: "+ M2);

    //Set timeout to change secure vault
    setTimeout(() => { 
      AuthService.changeSecureVault()} ,duration );

    res.status(200).json(M2_response);
  }
  else{
      console.log("Invalid Device Id");
      return res.status(401).send("Invalid Device Id"); // else, return 401 Unauthorized status code
  }
});

authRouter.post("/m3", async (req: any, res: any) => {
  const M3 = req.body;
  if (!M3) {
    console.log("Missing Message M3");
    return res.status(400).json({ error: 'Missing Message M3 ' });
  }
  else{
    console.log("SERVER: Received Message M3!");
    //decrypt M3
    console.log("M3 Decrypting ...");
    const decryptedM3 = AuthService.decryptM3(M3);
    console.log("Decrypted M3: ", decryptedM3);
    //if (decryptedM3.r1 == cache('r1')) --> generate M4
    if(decryptedM3.r1 == cache['r1']){

      const M4 = AuthService.generateM4(decryptedM3); 
      const M4_response = {
        message: 'Message M3 received! Sending Message M4 ...',
        M4: M4
      }
      console.log(" Sending Message M4 ...");
      res.status(200).json(M4_response);
      console.log("Exchanging data with Device...")
    }
  }
});