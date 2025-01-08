const express = require('express');
import * as http from "http";
const dotenv = require('dotenv');

dotenv.config();
const port = process.env.PORT;

import {authRouter} from "./Routes/auth";


const app = express();
app.use(express.json());
app.use("/auth",authRouter);

app.get('/', (req: any, res: any) => {
    res.send('Hello World!')
  })

  

    


let server = http.createServer(app);
server.listen(port, ()=>console.log("HTTP server starting"));

