import express from "express";
import { authUser } from "./middleware/auth.js";

const app = express();

// app.use("/user", authUser);

app.get("/user",authUser, (req, res) => {
  res.send("user all data");
});
app.post("/user/login", (req, res) => {
  res.send("Logininig");
});

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});
