const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

dotenv.config({path:'config/config.env'});

module.exports = app;