import express from "express";
import User from "../models/userSchema.js";
import Course from "../models/courseSchema.js";
import { authUser } from "../middleware/auth.js";
import JWT from "jsonwebtoken";
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.find({ username: username });
    console.log(user);
    if (user.length > 0) {
      return res.send("user exists");
    }

    const admin = new User({
      username: username,
      password: password,
    });

    await admin.save();

    res.json({ message: "Signup successfully", data: admin });
  } catch (error) {
    res.send(error.message);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });

    if (user) {
      if (user.password === password) {
        const token = JWT.sign({ username }, "secret");
        res.status(200).json({
          message: "Login Successfull",
          token: token,
        });
      } else {
        throw new Error("invalid credential");
      }
    }
  } catch (error) {
    res.send(error.message);
  }
});

userRouter.get("/courses", authUser, async (req, res) => {
  try {
    const user = req.user;
    const courses = await Course.find({
      _id: {
        $in: user.purchasedCourse,
      },
    });
    console.log(courses);

    res.json({
      message: "ALL courses",
      courses: courses,
    });
  } catch (error) {
    res.send(error.message);
  }
});

userRouter.get("/course/:id", authUser, async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.id;

    const isCourseAvailable = await Course.findById(id);

    if (!isCourseAvailable) {
      return res.json({ message: "Course is Unavailable" });
    }

    const coursed = await User.findByIdAndUpdate(req.id, {
      $push: { purchasedCourse: id },
    });
    console.log(coursed);

    res.json({
      message: "Course purchased successfully",
    });
  } catch (error) {
    res.send(error.message);
  }
});

export default userRouter;
