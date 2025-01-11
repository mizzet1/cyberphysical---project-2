import express from "express";
import { cache } from "..";
import { AuthService } from "../Services/authService";

export const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post("/m1", async (req: any, res: any) => {
  const deviceId = req.body.deviceId;
  const sessionId = req.body.sessionId;

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
    res.status(200).json(M2_response);
  }
  else{
      console.log("Invalid Device Id");
      return res.status(401).send("Invalid Device Id"); // else, return 401 Unauthorized status code
  }
});

authRouter.post("/m3", async (req: any, res: any) => {
  const m3 = req.body;
  if (!m3) {
    return res.status(400).json({ error: 'Missing Message M3 ' });
  }
  else{
    //decrypt M3
    const decryptedM3 = AuthService.decryptM3(m3);
    //if (respose.r1 == myCache.get('r1')) --> genero M4
    if(decryptedM3.r1 == cache['r1']){
      const M4 = AuthService.generateM4(); // if valid Device ID --> generate message M4
      const M4_response = {
        message: 'Message M3 received! Sending Message M4 ...',
        M4: M4
      }
      res.status(200).json(M4_response);
    }
  }
});