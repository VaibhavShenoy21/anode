const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const session = require("express-session");

const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "cards",
})

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    key: "userId",
    secret:"subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    }
}))

app.post("/api/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password,saltRounds,(err,hash)=>{
        if (err){
            console.log(err)
        }
        const sqlInsert = "INSERT INTO user_db (username,password) VALUES (?,?)";
        db.query(sqlInsert, [username,hash],(error,result) => {
        if(error){
            console.log(error);
        }
    })
    })
    
})

app.get('/api/login', (req, res) => {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    } else {
        res.send({loggedIn: false});
    }

})

app.get('/api/logout', (req, res) => {
    if (req.session.user) {
        req.session.user = null
        res.send({loggedIn: false});
    }
})

app.post('/api/login',(req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("SELECT * FROM user_db WHERE username = ?;",username,(err,result)=>{
        if(err){
            res.send({err: err});
        }
        if(result.length > 0){
            bcrypt.compare(password, result[0].password, (error,response)=>{
                if (response){
                    req.session.user = result;
                    console.log(req.session.user);
                    res.send(result)
                } else {
                    res.send({message: "Wrong username/password combination!"});
                }
            })
        }else{
            res.send({message: "User Dosent Exist"});
        }
    })
})


app.get("/api/get", (req,res) => {
    const sqlGet = "SELECT * FROM card_db";
    db.query(sqlGet, (error,result)=>{
        res.send(result);
    })
})

app.get("/api/get1", (req,res) => {
    const sqlGet = "SELECT * FROM card_db where status = 'To Do'";
    db.query(sqlGet, (error,result)=>{
        res.send(result);
    })
})

app.get("/api/get2", (req,res) => {
    const sqlGet = "SELECT * FROM card_db where status = 'In Progress'";
    db.query(sqlGet,(error,result)=>{
        res.send(result);
    })
})

app.get("/api/get3", (req,res) => {
    const sqlGet = "SELECT * FROM card_db where status = 'Completed'";
    db.query(sqlGet, (error,result)=>{
        res.send(result);
    })
})

app.post("/api/post", (req,res) => {
    const {title,des,status,user} = req.body;
    const sqlInsert = "INSERT INTO card_db (title,des,status,user) VALUES (?,?,?)";
    db.query(sqlInsert, [title,des,status,user],(error,result) => {
        if(error){
            console.log(error);
        }
    })
    
})

app.post("/api/post1", (req,res) => {
    const {title,des,useruser,status} = req.body;
    const sqlInsert = "INSERT INTO card_db (title,des,useruser,status) VALUES (?,?,?,'To Do')";
    db.query(sqlInsert, [title,des,useruser,status],(error,result) => {
        if(error){
            console.log(error);
        }
    })
})

app.post("/api/post11", (req,res) => {
    const username= req.body.username;
    const sqlInsert = "INSERT INTO new_db VALUES ('das');";
    db.query(sqlInsert,username,(error,result) => {
        if(error){
            console.log(error);
        }
    })
})

app.post("/api/post2", (req,res) => {
    const {title,des,useruser,status} = req.body;
    const sqlInsert = "INSERT INTO card_db (title,des,useruser,status) VALUES (?,?,?,'In Progress')";
    db.query(sqlInsert, [title,des,useruser,status],(error,result) => {
        if(error){
            console.log(error);
        }
    })
})

app.post("/api/post3", (req,res) => {
    const {title,des,useruser,status} = req.body;
    const sqlInsert = "INSERT INTO card_db (title,des,useruser,status) VALUES (?,?,?,'Completed')";
    db.query(sqlInsert, [title,des,useruser,status],(error,result) => {
        if(error){
            console.log(error);
        }
    })
})

app.delete("/api/remove/:id", (req,res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM card_db WHERE id = ?";
    db.query(sqlRemove, id ,(error,result) => {
        if(error){
            console.log(error);
        }
    })
})

app.get("/api/get/:id", (req,res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM card_db where id = ?";
    db.query(sqlGet, id , (error,result)=>{
        if (error) {
            console.log(error)
        }
        res.send(result);
    })
})

app.put("/api/update/:id", (req,res) => {
    const { id } = req.params;
    const {title,des} = req.body;
    const sqlUpdate = "UPDATE card_db SET title = ?, des = ? WHERE id = ?";
    db.query(sqlUpdate, [title ,des , id] , (error,result)=>{
        if (error) {
            console.log(error)
        }
        res.send(result);
    })
})

app.put("/api/update1/:id", (req,res) => {
    const { id } = req.params;
    const sqlUpdate = "UPDATE card_db SET status = 'In Progress' WHERE id = ?";
    db.query(sqlUpdate,  id , (error,result)=>{
        if (error) {
            console.log(error)
        }
        res.send(result);
    })
})
app.put("/api/update2/:id", (req,res) => {
    const { id } = req.params;
    const sqlUpdate = "UPDATE card_db SET status = 'To Do' WHERE id = ?";
    db.query(sqlUpdate,  id , (error,result)=>{
        if (error) {
            console.log(error)
        }
        res.send(result);
    })
})
app.put("/api/update3/:id", (req,res) => {
    const { id } = req.params;
    const sqlUpdate = "UPDATE card_db SET status = 'Completed' WHERE id = ?";
    db.query(sqlUpdate,  id , (error,result)=>{
        if (error) {
            console.log(error)
        }
        res.send(result);
    })
})
app.put("/api/update4/:id", (req,res) => {
    const { id } = req.params;
    const sqlUpdate = "UPDATE card_db SET status = 'In Progress' WHERE id = ?";
    db.query(sqlUpdate,  id , (error,result)=>{
        if (error) {
            console.log(error)
        }
        res.send(result);
    })
})



app.get("/",(req,res) =>{
    // const sqlInsert = "INSERT INTO contact_db (name,email,contact) VALUES ('vaibhavshenoy','vaibhavshenoy1@gmail.com','4253423445')";
    // db.query(sqlInsert,(error,result) =>{
    //     console.log("error",error);
    //     console.log("result",result);
    // })
    // res.send("Hello Express");
})

app.listen(5000, ()=>{
    console.log("Server is Running on port 5000");
})
