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

/*const dbquery = (sql, data) => pool.query(sql, data, (err, result) => {
    if( err ) {
        console.log(err);   
    }
    res.send(result);
});*/

app.get("/BuyerRegister", function(req, res) {
    pool.query('select * from demo', (err, result, fields) => {
        if( err ) {
            console.log(err);
        }
        res.send(result);
    });
});

app.post("/BuyerRegister", async function(req, res){
    const phoneno = req.body.phoneno;
    const email = req.body.emailid;
    const name = req.body.username;
    const mpin = req.body.smallpin;
    const password = req.body.passwords;
    const address = req.body.addresses;

    var sql1 = "insert into logindetails set ?"
    const data1 = { PhoneNo: phoneno, MPin: mpin, Password: password, UserType: "Buyer"}

    var sql2 = "insert into buyerdetails set ?"
    const data2 = { PhoneNo: phoneno, EmailId: email, Name: name, Address: address, ProfilePic:""}

    /*pool.getConnection(function(error, connection){
        if(error){
            return cb(error);
        }
        else{
            pool.query(sql1, data1, (err, result1, fields))
        }
    })*/
    
    pool.query(sql1, data1, (err, result, _fields) => {
        if( err ) {
            console.log(err);   
        }
        else{
            //res.send(result1);
            //res.end();
            pool.query(sql2, data2, (err, result, _fields) => {
                if (err) {
                    console.log(err);
                }
                //res.send(result2);
                //res.end();
            });
        }
    });
});

app.listen( port, function() {
    console.log("server is ready at port " + port);
});