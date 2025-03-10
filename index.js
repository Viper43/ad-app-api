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

app.post("/buyerRegister", async function(req, res){
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

    if(phoneno !="" && name != "" && mpin != "" && password != "" && address != "" ) {

        pool.query(sql1, data1, (err, result, fields) => {
            if( err ) {
                console.log(err);  
            }
            else{
            pool.query(sql2, data2, (err, result, fields) => {
                if (err) {
                    console.log(err);
                }
                else{
                    res.send({status: true});
                    res.end();
                }  
            });
            }
        });
    }
});

app.post("/buyerProfile", function(req, res) {
    var pno = req.body.pNo;
    var sql = "select * from buyerdetails where PhoneNo = ?"
    pool.query(sql, [pno], (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
});

app.post("/cart", function(req, res) {
    
    var pno = req.body.pNo;
    var sql = "select * from productdetails, cartdetails where productdetails.ProductId=cartdetails.ProductId and cartdetails.BuyerPhone = ?"
    
    pool.query(sql, [pno], (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
});

app.post("/loginPass", async function(req, res){
    const phoneno = req.body.phoneno;
    const password = req.body.password;

    var sql = "select UserType from logindetails where PhoneNo = ? and Password = ?";

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

app.post("/loginPin", async function(req, res){
    const phoneno = req.body.phoneno;
    const mpin = req.body.smallpin;

    var sql = "select UserType from logindetails where PhoneNo = ? and MPin = ?";

    pool.query(sql, [phoneno, mpin], (err, result, fields) => {
        if( err ) {
            console.log(err);  
        }
        else{
            res.send(result);
            res.end();
        }
    });
});

app.post("/sellerRegister", async function(req, res){
    const phoneno = req.body.phoneno;
    const email = req.body.emailid;
    const name = req.body.username;
    const mpin = req.body.smallpin;
    const password = req.body.passwords;
    const shopname = req.body.shopname;
    const shopaddress = req.body.shopaddress;

    var sql1 = "insert into logindetails set ?"
    const data1 = { PhoneNo: phoneno, MPin: mpin, Password: password, UserType: "Seller"}

    var sql2 = "insert into sellerdetails set ?"
    const data2 = { PhoneNo: phoneno, EmailId: email, Name: name, ShopName: shopname, ShopAddress: shopaddress} 

    if(phoneno!="" && name!="" && mpin!="" && password!="" && shopaddress!="" ) {

        pool.query(sql1, data1, (err, result, fields) => {
            if( err ) {
                console.log(err);  
            }
            else{
                pool.query(sql2, data2, (err, result, fields) => {
                    if (err) {
                        console.log(err);
                    }
                    else{
                        res.send({status: true});
                        res.end();
                    }  
                });
            }
        });
    }
});

app.post("/sellerProfile", function(req, res) {
    
    var pno = req.body.pNo;
    var sql = "select * from sellerdetails where PhoneNo = ?"
    
    pool.query(sql, [pno], (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
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
    
    var pno = req.body.pNo;
    var id = req.body.id;
    var sql1 = "select * from productdetails where CategoryId = ?";
    var sql2 = "select * from cartdetails where BuyerPhone = ?";
    var sql3 = "select * from wishlist where BuyerPhone = ?";

    pool.query(sql1, [id], (err, result, fields) => {
        if( err ) {
            console.log(err);
        }
        else {
            pool.query(sql2, [pno], (err, result2, fields) => {
                if( err ) {
                    console.log(err);
                }
                else{
                    pool.query(sql3, [pno], (err, result3, fields) => {
                        if( err ) {
                            console.log(err);
                        }
                        else{
                            res.send({content: result, cart: result2, wishlist: result3});
                            res.end();
                        }
                    });
                }
                
            });
        }
    });
});

app.post("/wishlist", function(req, res) {
    
    var pno = req.body.pNo;
    var sql = "select * from productdetails, wishlist where productdetails.ProductId = wishlist.ProductId and wishlist.BuyerPhone = ?"
    
    pool.query(sql, [pno], (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
});

app.post("/addToCart", function(req, res) {
    
    var pno = req.body.pNo;
    var pId = req.body.id
    var sql = "insert into cartdetails set ?"
    const data = { BuyerPhone: pno, ProductId: pId} 

    pool.query(sql, data, (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
});

app.post("/sellerContents", function(req, res) {
    
    var pNo = req.body.pno;
    var sql = "select * from productdetails where SellerPhone = ?";

    pool.query(sql, [pNo], (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
});

app.post("/editProduct", async function(req, res){
    const info = req.body.pinfo;
    const about = req.body.pabout;
    const pid  = req.body.pid;

    var sql = "update productdetails set ProductInfo = ?, About = ? where ProductId = ?"

    pool.query(sql, [info, about, pid], (err, result, fields) => {
        if( err ) {
            console.log(err);  
        }   
        res.send(); 
    });
    
});

app.post("/addProduct", async function(req, res){
    const name = req.body.productname;
    const aprice = req.body.actualprice;
    const dprice = req.body.discountedprice;
    const dpercent = req.body.discountpercent;
    const pinfo = req.body.productinfo;
    const about = req.body.productabout;
    const pno = req.body.phoneno;
    let prodPic;
    // logic needs to be implemented properly by fetching pic from front end and then checking not null of the variable
    if( true ) {
        prodPic = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png";
    }
    var sql = "insert into productdetails set ?"
    const data = { ProductName: name, ActualPrice: aprice, DiscountedPrice: dprice, DiscountPercent: dpercent, ProductInfo: pinfo, About: about, SellerPhone: pno, ProductImage: prodPic} 

    pool.query(sql, data, (err, result, fields) => {
        if( err ) {
            console.log(err);  
        }
        res.send();
    });
});

app.post("/addToWishlist", function(req, res) {
    
    var pno = req.body.pNo;
    var pId = req.body.id
    var sql = "insert into wishlist set ?"
    const data = { BuyerPhone: pno, ProductId: pId} 

    pool.query(sql, data, (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
});

app.post("/removeFromCart", function(req, res) {
    
    var pno = req.body.pNo;
    var pId = req.body.id
    var sql = "delete from cartdetails where ProductId = ? and BuyerPhone = ?" 

    pool.query(sql, [pId, pno], (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
});

app.post("/removeProduct", function(req, res) {
    
    var pno = req.body.pNo;
    var pId = req.body.id
    var sql = "delete from productdetails where ProductId = ? and SellerPhone = ?" 

    pool.query(sql, [pId, pno], (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
});

app.post("/removeFromWishlist", function(req, res) {
    
    var pno = req.body.pNo;
    var pId = req.body.id
    var sql = "delete from wishlist where ProductId = ? and BuyerPhone = ?" 

    pool.query(sql, [pId, pno], (err, result, fields) => {
        if( err ) {
            return console.log(err);
        }
        res.send(result);
    });
});

app.post("/sellerEditProfile", async function(req, res){
    const pno = req.body.pno;
    const mail = req.body.email;
    const sname  = req.body.sname;
    const saddress = req.body.saddress;
    
    var sql = "update sellerdetails set EmailId = ?, ShopName = ?, ShopAddress = ? where PhoneNo = ?"

    pool.query(sql, [mail, sname, saddress, pno], (err, result, fields) => {
        if( err ) {
            console.log(err);  
        }   
        res.send(); 
    });
    
});

app.post("/buyerEditProfile", async function(req, res){
    const pno = req.body.pno;
    const mail = req.body.email;
    const address = req.body.address;

    var sql = "update buyerdetails set EmailId = ?, Address = ? where PhoneNo = ?"

    pool.query(sql, [mail, address, pno], (err, result, fields) => {
        if( err ) {
            console.log(err);  
        }   
        res.send(); 
    });
    
});

app.post("/notifications", function(req, res) {
    
    var pno = req.body.pNo;
    
    var sql1 = "select * from productdetails";
    pool.query(sql1, (err, result, fields) => {
        if( err ) {
            console.log(err);
        }
        else {
            res.send(result);
            res.end();
        }
    });
});


app.listen( port, function() {
    console.log("server is ready at port " + port);
});