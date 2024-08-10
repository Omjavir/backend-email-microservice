const express = require("express");
const { sendMail } = require("./services/email");
require("dotenv").config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.post("/api/mail", sendMail);

app.listen(5000, () => {
  console.log("http://localhost:5000");
});
