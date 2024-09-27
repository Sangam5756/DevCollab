import express from "express";

const app = express();

app.use(
  "/user",
  [
    (req, res, next) => {
      console.log("response 1");
      // res.send("response 1");
      next();
    },
    (req, res, next) => {
      console.log("response 2");
      // res.send("response 2");
      next();
    },
  ],
  (req, res, next) => {
    console.log("response 3");
    // res.send("response 3");
    next();
  },
  (req, res, next) => {
    console.log("response 4");
    res.send("response 4");
    // next();
  },
  (req, res, next) => {
    console.log("response 5");
    res.send("response 5");
  }
);

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});
