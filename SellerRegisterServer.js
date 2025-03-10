const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {createPool} = require('mysql');
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

const port = 8080;

const pool = createPool({
    host: "",
    user: "",
    password: "",
    database: "",
});