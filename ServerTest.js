const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {createPool} = require('mysql');
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));


const port = 8080;

/*const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "test",
    connectionlimit: 10
});*/
flag  = false;
const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "flybuy",
});

function dbquery(sql, data) {
    
    pool.query(sql, data, (err, result) => {
        if( err ) {
            console.log(err);
            flag = false;
            return err; 
        }
        flag = true;
        console.log('1st query ' + flag);
        return true;
    });
}

app.get("/data", function(req, res) {
    pool.query('select * from contents', (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        console.log(result);
        return res.send(result);
    });
});

app.post("/register",function(req, res){
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
    
    if( dbquery(sql1, data1) ) {
        dbquery(sql2, data2);
    }
});
/*app.post("/data", function(req, res){
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    var sql = "insert into demo set ?";
    const data = { FirstName: firstname, LastName: lastname}
    
    pool.query(sql, data, (err, result) => {
        if( err ) {
            return console.log(err);
        }
        return res.send(result);
    });
});
*/
app.listen( port, function() {
    console.log("server is ready at port " + port);
});