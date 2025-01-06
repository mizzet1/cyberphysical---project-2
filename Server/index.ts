const express = require('express');
import * as http from "http";
const dotenv = require('dotenv');

dotenv.config();
const port = process.env.PORT;

import {authRouter} from "./Routes/auth";


const app = express();



app.get('/', (req, res) => {
    res.send('Hello World!')
  })


let server = http.createServer(app);
server.listen(port, ()=>console.log("HTTP server starting"));
