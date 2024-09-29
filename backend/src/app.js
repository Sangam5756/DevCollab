import express from "express";
import dbConnect from "./config/database.js";
import userModel from "./models/userSchema.js";
import validateSignupData from "./utils/validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import validator from "validator";
import { authUser } from "./middleware/auth.js";
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    // validate req body
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // password encryption
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new userModel({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();

    res.status(200).send("Signup SUccessfull");
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid creadential");
    }
    const user = await userModel.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid creadential");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "thisissecret", {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 3600000),
      });
      res.send("login successfull");
    } else {
      throw new Error("Invalid creadential");
    }
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

app.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

app.post("/connection", authUser, (req, res) => {
  try {
    res.send("connection request sendby : " + req.user.firstName);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

dbConnect()
  .then(() => {
    console.log("DataBase connection established");
    app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Connection to database failed" + err));
