const express = require('express');
const path = require('path');
const app = express();

//set the public folder
app.use('/public', express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const book = [
    { "title": "aaa", "price": 999 },
    { "title": "bbb", "price": 199 },
    { "title": "ccc", "price": 899 },
];


// ======= wed services, ed API, routes =======
// get all book
app.get('/book', function (req, res) {
    res.json(book);
})

// logig GET
app.get('/login/:username/:password', function (req, res) {
    // http://localhost:3000/login/admin/1234
    // const username = req.params.username;
    // const password = req.params.password;
    const { username, password } = req.params;
    // console.log(username,password);
    if (username == 'admin' && password == '1234') {
        res.status(200).send('Login Success');
    } else {
        res.status(401).send('Login failed');
    }
});

//login POST
app.post('/login', function (req, res) {
    // const username = req.body.username;
    // const password = req.body.password;
    const { username, password } = req.body;
    // console.log(username,password);
    // res.end();
    if (username == 'admin' && password == '1234') {
        res.status(200).send('Login Success');
    } else {
        res.status(401).send('Login failed');
    }
})

// service returns the current server's time
app.get('/now', function (_req, res) {
    res.send(new Date().toLocaleString());
});

//root service
app.get('/', function (_req, res) {
    // res.send('Hoooouuu');
    // res.sendFile(__dirname + '/views/w8/index.html');
    res.sendFile(path.join(__dirname + '/views/w8/index_book.html'));
});

const PORT = 3000;
app.listen(PORT, function () {
    console.log('Server is runnint at port ' + PORT);
});
