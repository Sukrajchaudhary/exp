require("dotenv").config();
const { connectToDb } = require("./config/connection");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const parser = require("body-parser");
const authRouter = require("./router/Auth.router");
const businessRegisterRouter=require("./router/Business.route")
const userRouter = require("./router/Users.router");
connectToDb();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(session({ secret: "keyboard cat", cookie: { maxAge: 60000 } }));
app.use(express.json());
app.use(parser.urlencoded({ extended: true }));
app.use(cookieParser());
//
app.use("/api/", authRouter.router);
app.use("/api/", userRouter.router);
app.use("/api/",businessRegisterRouter.router)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App is Running ${PORT}`);
});
