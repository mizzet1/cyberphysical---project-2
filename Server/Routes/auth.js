"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.authRouter = express_1.default.Router();
exports.authRouter.use(express_1.default.json());
exports.authRouter.post("/m1", (req, res) => {
    const { device_id, session_id } = req.params;
    console.log(device_id);
    if (checkDeviceId(device_id, session_id)) {
        console.log("Device Id is valid");
        const M2 = generateM2(); // if valid Device ID --> generate message M2
        return res.status(200).json(M2);
    }
    else {
        console.log("Invalid Device Id");
        return res.status(401).send("Invalid Device Id"); // else, return 401 Unauthorized status code
    }
});
//Check if DeviceId of the request is known to server
function checkDeviceId(device_id, session_id) {
    const data = require("../devices.json");
    let found = false;
    data.devices.forEach((device) => {
        if (device_id == device.device_id.toString()) {
            found = true;
            //save session_id of the device
            device.session_id = session_id;
        }
    });
    return found;
}
//ge
function generateM2() {
    const r1 = generateR1();
    const C1 = generateC1();
    const M2 = {
        r1: r1,
        C1: C1
    };
    return M2;
}
// geenrateC1
function generateC1() {
    const c1 = [];
    // Generates p, a random number from 2 and 7 (i.e. at least 2 keys, at most 7 (n-1) keys). 
    // p determines the number of keys indeces for C1
    const p = Math.floor(Math.random() * 6) + 2;
    const indeces = [0, 1, 2, 3, 4, 5, 6, 7];
    for (let i = 0; i < p; i++) {
        const current_index = Math.floor(Math.random() * indeces.length);
        c1.push(indeces[current_index]);
        indeces.splice(current_index, 1);
    }
    return c1;
}
// generateR1
function generateR1() {
    return Math.floor(Math.random() * 1000);
}
