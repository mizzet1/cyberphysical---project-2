const express = require('express');
import * as http from "http";
const dotenv = require('dotenv');
import {m1Router} from "./Routes/m1Router";
const cors = require('cors');  // CommonJS style import

dotenv.config();
const port = process.env.PORT;

const app = express();

// Parse request body as JSON
app.use(express.json());

// Enable CORS only for the Angular client
const corsOptions = {
  origin: 'http://localhost:4200',  // Allow only the Angular client to access
  methods: ['GET', 'POST'],  // Allow only specific HTTP methods
  allowedHeaders: ['Content-Type'],  // Allow specific headers
};
app.use(cors(corsOptions));

// Define the routes
app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})

app.use("/m1", m1Router);

  // Start the server
let server = http.createServer(app);
server.listen(port, ()=>console.log(`Server is running on http://localhost:${port}`));

