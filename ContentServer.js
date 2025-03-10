const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {createPool} = require('mysql');
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

const port = 8090;

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "flybuy",
    connectionlimit: 10
});

app.get("/contents", function(req, res) {
    pool.query('select * from productdetails', (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
});

app.post("/contents", function(req, res) {
    const id = req.body.id;

    var sql = "select * from productdetails where ProductId = ?";
    const data = id;

    pool.query(sql, data, (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
});

app.listen(port, function() {
    console.log('Server listening to port  ' + port);
});