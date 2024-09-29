import express from "express";
import {authUser} from "../middleware/auth.js";

const requestRouter = express.Router();

requestRouter.post("/connection", authUser, (req, res) => {
  try {
    res.send("connection request sendby : " + req.user.firstName);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

export default requestRouter;
