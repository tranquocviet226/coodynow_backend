const mongoose = require('mongoose')

const User = new mongoose.Schema({
    email: String,
    password: String,
    fullname: String,
    gender: String,
    phone: String,
    birthday: String,
    image: String,
    cart: Object
})

module.exports = mongoose.model("users", User)