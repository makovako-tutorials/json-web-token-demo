require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// normally store in DB or cache
let refreshTokens = [];

// route to regenerate token
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.post("/login", (req, res) => {
  //Authenticate user - different video

  const username = req.body.username;
  const user = { name: username };

  //run in node
  // require('crypto').randomBytes(64).toString('hex');
  //serialize user
  const accessToken = generateAccessToken(user);
  // create refresh token for user
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  //store refresh token in DB
  refreshTokens.push(refreshToken);

  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

app.delete("/logout", (req, res) => {
  // delete refesh token from DB
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
});

function generateAccessToken(user) {
  // after 15 seconds access token will be invalid
  // need to be refresh with refresh token
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

app.listen(7000);
