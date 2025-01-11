const express = require('express');
import * as http from "http";
const dotenv = require('dotenv');
import {authRouter} from "./Routes/auth";
const cors = require('cors');  // CommonJS style import

dotenv.config();
const port = process.env.PORT;

const app = express();

// Parse request body as JSON
app.use(express.json());

// Shared cache
export let cache: { [key: string]: any } = {};

// Enable CORS only for the Angular client
const corsOptions = {
  origin: 'http://localhost:4200',  // Allow only the Angular client to access
  methods: ['GET', 'POST'],  // Allow only specific HTTP methods
  allowedHeaders: ['Content-Type'],  // Allow specific headers
};
app.use(cors(corsOptions));

// Define the routes
app.get('/', (req: any, res: any) => {
  res.send('Server is running ...');
})

app.use("/auth", authRouter);

  // Start the server
let server = http.createServer(app);
server.listen(port, ()=>console.log(`Server is running on http://localhost:${port}`));