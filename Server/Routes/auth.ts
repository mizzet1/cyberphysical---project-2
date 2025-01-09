import express from "express";
import { copyFileSync } from "fs";

export const authRouter = express.Router();
authRouter.use(express.json());

const authService = require("../Services/authService");

authRouter.post("/m1", async (req: any, res: any) => {
  const deviceId = req.body.deviceId;
  const sessionId = req.body.sessionId;

  // Check if the request body contains the required fields
  if (!deviceId || !sessionId) {
    return res.status(400).json({ error: 'Missing deviceId or sessionId' });
  }

  // Check if the Device ID is known to the server
  if (authService.checkDeviceId(deviceId, sessionId)){
    // generate M2
    const M2 = authService.generateM2(); // if valid Device ID --> generate message M2
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



