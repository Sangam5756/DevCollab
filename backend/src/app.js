import express from "express";
import dbConnect from "./config/database.js";
import userModel from "./models/userSchema.js";

const app = express();

app.post("/signup", async (req, res) => {
  const user = new userModel({
    firstName: "Tushar",
    lastName: "Shitole",
    emailId: "tusharshitole@gmail.com",
    password: "Secret@wsad",
  });

  await user.save();
  res.send("Signup successFull");
});

dbConnect()
  .then(() => {
    console.log("Connected to db");

    app.listen(5000, () => {
      console.log("server is listening on port 5000");
    });
  })
  .catch((err) => console.error("Connection to database failed" + err));
