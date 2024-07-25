const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
const UserInfo = require("./models/UserInfo");
const RefreshToken = require("./models/RefreshToken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
const secretRefresh = process.env.JWT_REFRESH_SECRET;
const key = process.env.MDB_API_KEY;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

mongoose.connect(
  `mongodb+srv://mattypond00:${key}@cluster0.32pnilj.mongodb.net/WritersBuddy?retryWrites=true&w=majority`
);

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

// Middleware to verify access token and handle refresh token if needed
const verifyTokens = async (req, res, next) => {
  const accessToken = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token not found" });
  }

  try {
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
                username: decodedRefreshToken.username,
                id: decodedRefreshToken.id,
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
  } catch (err) {
    console.error("Error verifying tokens:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

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
  const accessToken = jwt.sign({ username, id: userDoc._id }, secret, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ username, id: userDoc._id }, secretRefresh, {
    expiresIn: "2d",
  });

  // Store refreshToken securely using the RefreshToken model
  try {
    await RefreshToken.create({ userId: userDoc._id, token: refreshToken });
  } catch (error) {
    console.error("Error saving refresh token:", error);
    return res.status(500).json({ error: "Failed to save refresh token" });
  }

  res.cookie("token", accessToken, {
    httpOnly: true,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    // secure: true, // Set secure to true if your app uses HTTPS
    sameSite: "strict", // Adjust sameSite attribute based on your needs
    maxAge: 2 * 24 * 60 * 60 * 1000, // Max age in milliseconds (2 days in this case)
  });

  res.json({
    id: userDoc._id,
    username,
  });
});

app.get("/profile", verifyTokens, async (req, res) => {
  try {
    // Fetch user information based on decoded token
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // You can choose what information to return to the client
    const userInfo = {
      id: user._id,
      username: user.username,
      // Add other relevant user information here
    };

    res.json(userInfo);
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
    res.cookie("refreshToken", "", { httpsOnly: true });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(4000);