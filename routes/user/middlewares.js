const { validationResult } = require("express-validator");
const util = require("util");
const crypto = require("crypto");
const scrypt = util.promisify(crypto.scrypt);
const salt = crypto.randomBytes(8).toString("hex");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  async cryptPassword(password){
    const buf = await scrypt(password, salt, 64);
    const cryptoPass = `${buf.toString("hex")}.${salt}`;
    return cryptoPass;
  },
  async comparePasswords(passwordSaved, userPassword){
    const [hashed, salt] = passwordSaved.split(".");
    const hashedSupplied = await scrypt(userPassword, salt, 64)
    return hashed === hashedSupplied.toString('hex');
  },
  authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  },
  handleErrors() {
    return async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let err = [];
        for (const key in errors.errors) {
          err.push(errors.errors[key].msg);
        }
        return res.status(401).json(err);
      }
      next();
    };
  },
};
