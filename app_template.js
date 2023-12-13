const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const memorystore = require("memorystore")(session);
const con = require("./config/db");

const app = express();

// set the public folder
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up the session
app.use(
  session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    secret: "amSoSleepyAndNeed2CupsOfCoffee",
    resave: false,
    saveUninitialized: true,
    store: new memorystore({
      checkPeriod: 24 * 60 * 60 * 1000,
    }),
  })
);

// ------------- Logout --------------
app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send("Cannot logout");
    } else {
      res.redirect("/");
    }
  });
});

// ------------- Get user info --------------
app.get("/user", function (req, res) {
  // res.send(req.session.username);
  res.json({ username: req.session.username, userID: req.session.userID }); // res.json({ "username": req.session.username, "userID": req.session.id });
  // res.json({ id: req.session.id, username: req.session.username });
});

// ------------- Edit a product --------------
app.put("/products/:id", function (req, res) {
  const id = req.params.id;
  // const {name, price, amount} = req.body;
  // const updateProduct = {name: name, price: price, amount: amount};
  const updateProduct = req.body;
  const sql = "UPDATE product SET ? WHERE id = ?";
  con.query(sql, [updateProduct, id], function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database server error");
    }
    if (results.affectedRows != 1) {
      console.error("Row updated is not 1");
      return res.status(500).send("Update failed");
    }
    res.send("Update succesfully");
  });
});

// ------------- Add a new product --------------
app.post("/products", function (req, res) {
  // const {name, price, amount} = req.body;
  // const newProduct = {name: name, price: price, amount: amount};
  const newProduct = req.body;
  const sql = "INSERT INTO product SET ?";
  con.query(sql, newProduct, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database server error");
    }
    if (results.affectedRows != 1) {
      console.error("Row added is not 1");
      return res.status(500).send("Add failed");
    }
    res.send("Add succesfully");
  });
});

// ------------- DELETE a product --------------
app.delete("/products/:id", function (req, res) {
  const id = req.params.id;

  const updateProduct = req.body;
  const sql = "DELETE FROM product WHERE id = ?";
  con.query(sql, [id], function (err, results) {
    if (err) {
      res.status(500).send("Database server error");
    } else if (results.affectedRows != 1) {
      res.status(500).send("Delete failed");
    } else {
      res.send("Delete complete");
    }
  });
});

// ------------- GET all products --------------
app.get("/products", function (_req, res) {
  const sql = "SELECT * FROM product";

  con.query(sql, function (err, results) {
    if (err) {
      res.status(500).send("Database server error");
    } else {
      res.json(results);
    }
  });
});

// ---------- password generator -----------
app.get("/password/:pass", function (req, res) {
  bcrypt.hash(req.params.pass, 10, function (err, hash) {
    if (err) {
      console.error(err);
      res.status(500).send("Hahing error");
    } else {
      res.send(hash);
    }
  });
});

// ---------- login -----------
app.post("/login", function (req, res) {
  const { username, password } = req.body;

  const sql = "SELECT id, username, password, role FROM user WHERE username =?";

  con.query(sql, [username], function (err, results) {
    if (err) {
      res.status(500).send("Database server error");
    } else if (results.length != 1) {
      res.status(401).send("Username is not found");
    } else {
      //rew: password
      //hash: results[0].password
      bcrypt.compare(password, results[0].password, function (err, same) {
        if (err) {
          res.status(500).send("Password compare error");
        } else {
          if (same) {
            // res.send("Login successful");
            req.session.username = username;
            req.session.userID = results[0].id;
            req.session.role = results[0].role;
            res.send("/welcome");
          } else {
            res.status(401).send("Wron password");
          }
        }
      });
    }
  });
});

// ============ Page routes =================

app.get("/shop", function (req, res) {
  if (req.session.role == 2) {
    res.sendFile(path.join(__dirname, "views/shop.html"));
  } else {
    res.redirect("/");
  }
});

// ------------ admin page ----------
app.get("/welcome", function (req, res) {
  if (req.session.role == 1) {
    res.sendFile(path.join(__dirname, "views/welcome_template_delete.html"));
  } else {
    res.redirect("/");
  }
});

// ------------ root service ----------
app.get("/", function (req, res) {
  if (req.session.role == 1) {
    res.redirect("/welcome");
  } else if (req.session.role == 2) {
    res.redirect("/shop");
  } else {
    res.sendFile(path.join(__dirname, "views/login_template.html"));
  }
});

const PORT = 3000;
app.listen(PORT, function () {
  console.log("Server is runnint at port " + PORT);
});
