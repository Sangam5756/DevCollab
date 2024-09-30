import express from "express";
import { authUser } from "../middleware/auth.js";
import connectionRequest from "../models/connectionRequestSchema.js";

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
userRouter.get("/user/requests", authUser, async (req, res) => {
  // get all pending connection request

  try {
    const loggedInuser = req.user;

    const connectRequests = await connectionRequest
      .find({
        toUserId: loggedInuser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);

    res.status(200).json({
      message: "All pending connection requests",
      data: connectRequests,
    });
  } catch (error) {
    res.status(400).send("ERROR" + error.message);
  }
});

userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInuser = req.user;

    const data = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInuser._id, status: "accepted" },
          { fromUserId: loggedInuser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "All connection ",
      data: data,
      count: data.length,
    });
  } catch (error) {
    res.status(400).send("ERROR", error.message);
  }
});
export default userRouter;
