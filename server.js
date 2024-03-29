"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors = require('cors');
require('dotenv').config();
const hobbiesController = require('./controllers/hobbies');
const PORT = process.env.PORT || 3003;
//Middleware
app.use(express_1.default.json());
app.use(cors());
app.use('/hobbies', hobbiesController);
//Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});
//Start Server
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
});
