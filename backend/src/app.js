import express from "express";

const app = express();

app.get("/user", (req, res) => {
  // using try catch
  try {
    throw new Error("sdfdgdfg");
    res.send("user all data");
  } catch (err) {
    res.status(404).send("err is occured contact support team");
  }
});

// error handling using wild card for all
app.use("/", (err, req, res, next) => {
  res.send("something is wrong");
});

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});
