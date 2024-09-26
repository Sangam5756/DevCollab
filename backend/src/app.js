import express from "express";

const app = express();

app.use("", (req, res) => {
  res.send("Hiiiii, i am server ");
});

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});
