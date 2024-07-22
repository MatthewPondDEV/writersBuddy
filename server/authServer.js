const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
const RefreshToken = require("./models/RefreshToken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
const secretRefresh = process.env.JWT_REFRESH_SECRET;
const key = process.env.MDB_API_KEY;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

mongoose.connect(
  `mongodb+srv://mattypond00:${key}@cluster0.32pnilj.mongodb.net/WritersBuddy?retryWrites=true&w=majority`
);

// Middleware to verify access token and handle refresh token if needed
const verifyTokens = async (req, res, next) => {
  const accessToken = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not found' });
  }

  // Verify access token
  jwt.verify(accessToken, secret, async (err, decoded) => {
    if (err) {
      // If access token is expired or invalid, check refresh token
      if (err.name === 'TokenExpiredError') {
        try {
          const decodedRefreshToken = jwt.verify(refreshToken, secretRefresh);

          // Check if the refresh token exists in the database
          const storedRefreshToken = await RefreshToken.findOne({ userId: decodedRefreshToken.id });

          if (!storedRefreshToken || storedRefreshToken.token !== refreshToken) {
            throw new Error('Invalid refresh token');
          }

          // Generate new access token
          const newAccessToken = jwt.sign(
            { username: decodedRefreshToken.username, id: decodedRefreshToken.id },
            secret,
            { expiresIn: '15m' }
          );

          // Update the access token in the response cookies
          res.cookie('token', newAccessToken, { httpOnly: true });

          // Attach decoded token payload to request object
          req.user = decodedRefreshToken;

          next(); // Proceed to the route handler
        } catch (err) {
          console.error('Error verifying refresh token:', err);
          return res.status(401).json({ error: 'Unauthorized' });
        }
      } else {
        console.error('Error verifying access token:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }
    } else {
      // If access token is valid, attach decoded payload to request object
      req.user = decoded;
      next();
    }
  });
};