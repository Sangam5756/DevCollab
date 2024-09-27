import express from "express";
import dbConnect from "./config/database.js";

const app = express();
























dbConnect()
  .then(() => {
    console.log("Connected to db");

    app.listen(5000, () => {
      console.log("server is listening on port 5000");
    });
  })
  .catch((err) => console.error("Connection to database failed" + err));
