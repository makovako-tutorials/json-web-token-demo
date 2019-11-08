require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const posts = [
  {
    username: "Marek",
    title: "Post 1"
  },
  {
    username: "Lukas",
    title: "Post 2"
  }
];

app.get("/posts", authenticateToken, (req, res) => {

  res.json(posts.filter(post => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  //Authenticate user - different video

  const username = req.body.username;
  const user = { name: username };

  //run in node
  // require('crypto').randomBytes(64).toString('hex');
  //serialize user
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // authHeadre has format of Bearer TOKEN, split on space
  //if we have authheader split it
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  //verify, it returns error and object (user) which was serialized
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403) // user cannot be authorized
    req.user = user; // remember user in req and go to next middleware
    next()
  });
}

app.listen(6000);
