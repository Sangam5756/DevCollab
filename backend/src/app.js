import express from "express";
import dbConnect from "./config/database.js";
import userModel from "./models/userSchema.js";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);

  const isEmail = await userModel.find({ emailId: req.body.emailId });
  if (isEmail) {
    res.status(409).send("Email already exists");
  }

  const user = new userModel(req.body);

  await user.save();
  res.send("Signup successFull");
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

app.patch("/profile", async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.body.userId, req.body);
    if (!user) {
      res.send("Error");
    }
    res.send("Update success");
  } catch (error) {}
});

dbConnect()
  .then(() => {
    console.log("Connected to db");

    app.listen(5000, () => {
      console.log("server is listening on port 5000");
    });
  })
  .catch((err) => console.error("Connection to database failed" + err));
