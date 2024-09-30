import express from "express";
import { authUser } from "../middleware/auth.js";
import connectionRequest from "../models/connectionRequestSchema.js";

const userRouter = express.Router();

userRouter.get("/user/requests", authUser, async (req, res) => {
  // get all pending connection request

  try {
    const loggedInuser = req.user;

    const connectRequests = await connectionRequest
      .find({
        toUserId: loggedInuser._id,
        status: "interested",
      })
      .populate("fromUserId", ["firstName", "lastName"]);

    
    res.status(200).json({
      message: "All pending connection requests",
      data: connectRequests,
    });
  } catch (error) {
    res.status(400).send("ERROR" + error.message);
  }
});

export default userRouter;
