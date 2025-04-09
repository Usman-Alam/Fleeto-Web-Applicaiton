const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fName: String,
    lName: String,
    email: String,
    contact: String,
    Address: String,
    Password: String
})

module.exports = mongoose.model("User", userSchema);