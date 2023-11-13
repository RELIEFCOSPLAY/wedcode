const express = require("express");
const path = require("path");
const con = require("./config/db");

const app = express();
app.use("/public", express.static(path.join(__dirname, "public")));

// for json exchange
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============= Login ==============
app.post("/login", function (req, res) {
    // const username = req.body.username;
    // const password = req.body.password;

    const {username, password} = req.body;
    const sql = "SELECT id, username, role FROM user WHERE username =? AND password =?  ";

    con.query(sql, [username, password], function (err, results) {
        if (err) {
           res.status(500).send("Database server error");
        }
        else if (results.length != 1) {
            res.status(401).send("Wrong username or password");
        }
        else {
            res.send("Login successful");
        }
    });
});

// ============= Root ==============
app.get("/", function (_req, res) {
    res.sendFile(path.join(__dirname, "views/login_template.html"));
});

const port = 3000;
app.listen(port, function () {
    console.log("Server is ready at " + port);
});