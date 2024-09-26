import express from "express";

const app = express();

app.get("/user/:id", (req, res) => {
  // console.log(req.params)
  // console.log(req.query)

  res.send("Get user successfully");
});
app.post("/user", (req, res) => {   
  res.send("post user successfully");
});
app.patch("/user", (req, res) => {
  res.send("patch request successfully");
});
app.delete("/user", (req, res) => {
  res.send("delete request successfully");
});

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});
