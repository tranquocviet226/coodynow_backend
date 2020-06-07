const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const authRouter = require('./routes/user/auth')
const invoiceRouter = require('./routes/invoice/invoice')

//Connect DB
const connectDB = require("./config/db");
connectDB();
//Socket IO
io.on("connection", (socket) => {
  socket.on("Chat message", (msg) => {
    io.emit("Chat message", msg);
  });
});
// Bodyparser Middleware
app.use(express.json());
//Config router
app.use(authRouter);
app.use(invoiceRouter);
// Chay server
server.listen(process.env.PORT || 3000, () => {
  console.log("Server are running at 3000 PORT!");
});
