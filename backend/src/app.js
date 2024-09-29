import express from "express";
import dbConnect from "./config/database.js";
import userModel from "./models/userSchema.js";

const app = express();
const PORT  = 5000;

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = new userModel(req.body);
    await user.save();
    res.send("Signup SUccessfull");
  } catch (error) {
    res.status(400).send(error.message);
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
      console.log(`server is listening on port ${PORT}`)
    });
  })
  .catch((err) => console.error("Connection to database failed" + err));
