const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {createPool} = require('mysql');
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

const port = 8080;

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "flybuy",
    connectionlimit: 10
});

app.get("/categories", function(req, res) {
    pool.query('select * from categorydetails', (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
});


app.post("/contents", function(req, res) {
    
    var id = req.body.id;
    var sql = "select * from productdetails where ProductId = ?";

    pool.query(sql, [id], (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
});



app.listen(port, function() {
    console.log('Server listening to port  ' + port);
});