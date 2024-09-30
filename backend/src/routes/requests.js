import express from "express";
import { authUser } from "../middleware/auth.js";
import connectionRequest from "../models/connectionRequestSchema.js";
import userModel from "../models/userSchema.js";
import { message } from "antd";

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const fromUserId = req.user._id;

      const isUserExits = await userModel.findById(toUserId);
      if (!isUserExits) {
        return res.json({
          message: "User does not exist",
        });
      }

      // if (toUserId == fromUserId) {
      //   return res.json({ message: "can send request to self" });
      // }

      const isAllowedStatus = ["ignored", "interested"];
      if (!isAllowedStatus.includes(status)) {
        return res.json({
          message: "invalid status type :" + status,
        });
      }

      const existingConnectionRequest = await connectionRequest.find({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest.length !== 0) {
        return res.json({
          message: "Connection  request already exists",
        });
      }

      const connectionRequests = new connectionRequest({
        toUserId,
        fromUserId,
        status,
      });
      const toUser = await userModel.findById(toUserId);
      const data = await connectionRequests.save();

      let statusMessage = "";
      if (status == "interested") {
        statusMessage = `${req.user.firstName} is ${status} in ${toUser.firstName}`;
      } else {
        statusMessage = `${req.user.firstName} is ${status} the ${toUser.firstName}`;
      }
      console.log(statusMessage);
      res.json({
        message: statusMessage,
        data: data,
      });
    } catch (error) {
      res.status(400).send("ERROR:" + error.message);
    }
  }
);

export default requestRouter;
