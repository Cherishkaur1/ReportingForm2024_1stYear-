const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors());
dotenv.config({path:'config/config.env'});

module.exports = app;