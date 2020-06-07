const mongoose = require("mongoose");
const MONGO_URI =
  "mongodb+srv://tranquocviet226:khoqua226@mydb-unmzm.mongodb.net/food_order?retryWrites=true&w=majority";
const connectDB = async () => {
  const conn = await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
module.exports = connectDB;
