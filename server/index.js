const express = require("express");
const cors = require("cors");
const app = express();

// Enable CORS for all routes
app.use(cors());

app.use("/", (req, res) => {
    res.json({ users: ["userOne", "userTwo"] });
});

app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo"] });
});

app.listen(8000, console.log("Server is running on port 5001."));
