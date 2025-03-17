const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const app = express();
const userModel = require("../database/userSchema")

app.set('views', path.join(__dirname, '../views'));  // Set views directory
app.set('view engine', 'ejs');  // Set EJS as the template engine

mongoose.connect('mongodb://127.0.0.1:27017/fleeto_testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("MongoDB connection error: ", err));

app.get('/', (req, res) => {
    res.send("Fleeto home page");
})

app.get('/authenticate', (req, res) => {
    res.render('authenticate')
})

app.get('/maps', (req, res) => {
    res.render('maps')
})

app.listen(3001);

