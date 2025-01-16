"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const express = require('express');
const http = __importStar(require("http"));
const dotenv = require('dotenv');
const auth_1 = require("./Routes/auth");
const secureVaultService_1 = require("./Services/secureVaultService");
const cors = require('cors'); // CommonJS style import
dotenv.config();
const port = process.env.PORT;
const app = express();
// Parse request body as JSON
app.use(express.json());
// Shared cache
exports.cache = {};
// Enable CORS only for the Angular client
const corsOptions = {
    origin: 'http://localhost:4200', // Allow only the Angular client to access
    methods: ['GET', 'POST'], // Allow only specific HTTP methods
    allowedHeaders: ['Content-Type'], // Allow specific headers
};
app.use(cors(corsOptions));
// Define the routes
app.get('/', (req, res) => {
    res.send('Server is running ...');
});
app.use("/auth", auth_1.authRouter);
// Start the server
let server = http.createServer(app);
secureVaultService_1.SecureVaultService.initializeSecureVault().then(() => {
    server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
});
