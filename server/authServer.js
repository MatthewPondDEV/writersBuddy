const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const User = require("./models/User");
const UserInfo = require("./models/UserInfo");
const RefreshToken = require("./models/RefreshToken");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
const secretRefresh = process.env.JWT_REFRESH_SECRET;
const key = process.env.MDB_API_KEY;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

// MongoDB connection
mongoose.connect(
  `mongodb+srv://mattypond00:${key}@cluster0.32pnilj.mongodb.net/WritersBuddy?retryWrites=true&w=majority`
);

// Route to handle Google token exchange
app.post("/auth/google/token", async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Find or create user
    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.create({
        email: payload.email,
        googleId: payload.sub,
        username: payload.name,
      });
      const userInfo = await UserInfo.create({
        user_id: user._id,
        name: "",
        email: user.email,
        profilePicture: "",
        bio: "",
        experience: "",
        favoriteBooks: "",
        favoriteAuthors: "",
        favoriteGenre: "",
        goals: "",
        socialMediaLinks: {
          facebook: "",
          instagram: "",
          tiktok: "",
          pinterest: "",
          twitter: "",
        },
      });
    }

    // Generate JWTs
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      secret,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      secretRefresh,
      { expiresIn: "2d" }
    );

    try {
      await RefreshToken.findOneAndDelete({ userId: user._id });
      await RefreshToken.create({ userId: user._id, token: refreshToken });
    } catch (error) {
      console.error("Error managing refresh tokens:", error);
      return res.status(500).json({ error: "Failed to manage refresh tokens" });
    }

    // Send tokens to frontend
    res.cookie("token", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });
    res.json({
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error("Error handling Google token:", error);
    res.status(400).json({ error: "Invalid Google token" });
  }
});

// Middleware to verify access token and handle refresh token if needed
const verifyTokens = async (req, res, next) => {
  const accessToken = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token not found" });
  }

  // Verify access token
  jwt.verify(accessToken, secret, async (err, decoded) => {
    if (err) {
      // If access token is expired or invalid, check refresh token
      if (err.name === "TokenExpiredError") {
        try {
          const decodedRefreshToken = jwt.verify(refreshToken, secretRefresh);

          // Check if the refresh token exists in the database
          const storedRefreshToken = await RefreshToken.findOne({
            userId: decodedRefreshToken.id,
          });
          if (
            !storedRefreshToken ||
            storedRefreshToken.token !== refreshToken
          ) {
            throw new Error("Invalid refresh token");
          }

          // Generate new access token
          const newAccessToken = jwt.sign(
            {
              id: decodedRefreshToken.id,
              username: decodedRefreshToken.username,
            },
            secret,
            { expiresIn: "15m" }
          );

          // Update the access token in the response cookies
          res.cookie("token", newAccessToken, { httpOnly: true });
          // Attach decoded token payload to request object
          req.user = decodedRefreshToken;

          next(); // Proceed to the route handler
        } catch (err) {
          console.log("Error verifying refresh token:", err);
          return res.status(401).json({ error: "Unauthorized" });
        }
      } else {
        console.error("Error verifying access token:", err);
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      // If access token is valid, attach decoded payload to request object
      req.user = decoded;
      next();
    }
  });
};

// Registration and Login routes
app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const userDoc = await User.create({
      email,
      username,
      password: bcrypt.hashSync(password, salt),
    });
    const userInfo = await UserInfo.create({
      user_id: userDoc._id,
      name: "",
      email: userDoc.email,
      profilePicture: "",
      bio: "",
      experience: "",
      favoriteBooks: "",
      favoriteAuthors: "",
      favoriteGenre: "",
      goals: "",
      socialMediaLinks: {
        facebook: "",
        instagram: "",
        tiktok: "",
        pinterest: "",
        twitter: "",
      },
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) {
    return res.status(400).json({ error: "User not found" });
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (!passOk) {
    return res.status(400).json({ error: "Wrong credentials" });
  }

  // User authenticated, generate tokens
  const accessToken = jwt.sign(
    { id: userDoc._id, username: userDoc.username },
    secret,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: userDoc._id, username: userDoc.username },
    secretRefresh,
    { expiresIn: "2d" }
  );

  // Delete previous refresh tokens and store new one
  try {
    await RefreshToken.findOneAndDelete({ userId: userDoc._id });
    await RefreshToken.create({ userId: userDoc._id, token: refreshToken });
  } catch (error) {
    console.error("Error managing refresh tokens:", error);
    return res.status(500).json({ error: "Failed to manage refresh tokens" });
  }

  res.cookie("token", accessToken, { httpOnly: true });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });
  res.json({ id: userDoc._id, username: userDoc.username });
});

app.get("/profile", verifyTokens, async (req, res) => {
  try {
    // Fetch user information based on decoded token
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    // Delete the refresh token from the database
    await RefreshToken.findOneAndDelete({ token: refreshToken });

    res.cookie("token", "", { httpOnly: true });
    res.cookie("refreshToken", "", { httpOnly: true });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(4000);
