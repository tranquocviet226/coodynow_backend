const { check } = require("express-validator");
const User = require("../../models/users");
const { comparePasswords } = require("./middlewares");

module.exports = {
  requireEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email phải đúng định dạng")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email đã tồn tại");
      }
    }),
  requirePassword: check("password")
    .trim()
    .isLength({ min: 6, max: 12 })
    .withMessage("Mật khẩu phải từ 6 đến 12 kí tự"),
  requirePasswordConfirmation: check("passwordConfirmation")
    .trim()
    .custom(async (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Mật khẩu không khớp");
      }
    }),
  requireEmailSignin: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email phải đúng định dạng")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Không tìm thấy email");
      }
    }),
  requireFullName: check("fullname")
    .trim()
    .isLength({ min: 4, max: 50 })
    .withMessage("Tên phải từ 4 đến 50 kí tự"),
  requirePhone: check("phone")
    .trim()
    .isLength({ min: 8, max: 11 })
    .isNumeric()
    .withMessage("Số diện thoại phải từ 8 đến 11 chữ số"),
  requirePasswordSignin: check("password")
    .trim()
    .isLength({ min: 6, max: 12 })
    .withMessage("Mật khẩu phải từ 6 đến 12 kí tự")
    .custom(async (userPassword, { req }) => {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new Error("Mật khẩu không đúng");
      }
      //Comparepassword and check
      const validatePassword = await comparePasswords(
        user.password,
        userPassword
      );
      if (!validatePassword) {
        throw new Error("Mật khẩu không đúng");
      }
    }),
  requireNewEmail: check("newEmail")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email phải đúng định dạng")
    .custom(async (newEmail, { req }) => {
      if (newEmail !== req.body.email) {
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
          throw new Error("Email đã tồn tại");
        }
      }
    }),
};
