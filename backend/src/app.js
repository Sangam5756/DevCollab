import express from "express";
import dbConnect from "./config/database.js";
import userModel from "./models/userSchema.js";
import validateSignupData from "./utils/validator.js";
import bcrypt from "bcrypt";
import validator from "validator";
const app = express();
const PORT = 5000;

app.use(express.json());

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
      res.send("login successfull");
    } else {
      throw new Error("Invalid creadential");
    }
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await userModel.findOne({ emailId: req.body.emailId });
    if (user.length == 0) {
      res.status(404).send("user not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await userModel.find({});

    res.status(200).send({
      data: users,
      message: "All Users",
      success: true,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/profile", async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.body.userId);

    if (!user) {
      res.send("User Not Found");
    }

    res.send("User deleted successfully");
  } catch (error) {
    res.send(error);
  }
});

app.patch("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findByIdAndUpdate(userId, req.body, {
      runValidators: true,
    });
    if (!user) {
      res.send("Error");
    } else {
      res.send("Update success");
    }
  } catch (error) {
    res.send(error.message);
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
