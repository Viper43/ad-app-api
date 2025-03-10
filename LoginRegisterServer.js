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

app.post("/loginPass", async function(req, res){
    const phoneno = req.body.phoneno;
    const password = req.body.password;

    var sql = "select UserType from logindetails where PhoneNo = ? and Password = ?"
    //const data = { PhoneNo: phoneno, Password: password}

    pool.query(sql, [phoneno, password], (err, result, fields) => {
        if( err ) {
            console.log(err);  
        }
        else{
            res.send(result);
            res.end();
        }
    });
});

app.listen( port, function() {
    console.log("server is ready at port " + port);
});