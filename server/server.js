const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const User = require("./models/User");
const Project = require("./models/Project");
const Note = require("./models/Note");
const UserInfo = require("./models/UserInfo");
const BrainstormChat = require("./models/BrainstormChat");
const RefreshToken = require("./models/RefreshToken");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const axios = require("axios");
//const verifyTokens = require('./verifytokens'); // Import verifytokens middleware from Authorization API (Server A)
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
const secretRefresh = process.env.JWT_REFRESH_SECRET;
const key = process.env.MDB_API_KEY;
const openAIAPIKey = process.env.OPEN_AI_PROJECT_KEY;
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
    res.cookie("token", accessToken, { httpOnly: true});
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

app.get("/getProjects", verifyTokens, async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id });
    const userProjects = projects.map((project) => ({
      _id: project._id,
      title: project.title,
      createdBy: project.createdBy,
      summary: project.summary,
      cover: project.cover,
    }));
    res.json(userProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.post("/createProject", verifyTokens, async (req, res) => {
  try {
    const { title } = req.body;
    const projectDoc = await Project.create({
      title,
      createdBy: req.user.id,
      author: "",
      genre: "",
      summary: "",
      setting: {
        description: "You have not filled out this field",
        timePeriod: "You have not filled out this field",
        location: "You have not filled out this field",
      },
      plot: {
        summary: {
          introduction: "You have not filled out this field",
          development: "You have not filled out this field",
          resolution: "You have not filled out this field",
        },
      },
      write: {
        prologue: "You have not filled out this field",
        monologue: "You have not filled out this field",
        epilogue: "You have not filled out this field",
      },
      themes: {
        primary: {
          name: "Primary Theme",
          description: "",
          plan: "",
        },
        secondary: [
          {
            name: "Secondary Theme",
            description: "",
            plan: "",
          },
        ],
      },
    });
    res.json(projectDoc);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

app.get("/getProjectID", verifyTokens, async (req, res) => {
  try {
    // Assuming req.user contains decoded token payload from verifyTokens middleware
    const project = await Project.find({ createdBy: req.user.id })
      .limit(1)
      .sort({ $natural: -1 });

    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

app.get("/project/:id", verifyTokens, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

app.delete("/deleteProject", verifyTokens, async (req, res) => {
  try {
    const projectId = req.body.id;
    await Project.findByIdAndDelete(projectId);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(404).json({ error: "Failed to delete project" });
  }
});

app.put(
  "/projectOverview",
  uploadMiddleware.single("file"),
  verifyTokens,
  async (req, res) => {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    try {
      const { id, title, summary, genre, author } = req.body;
      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }
      await projectDoc.updateOne({
        title,
        summary,
        genre,
        author,
        cover: newPath ? newPath : projectDoc.cover,
      });
      res.json(projectDoc);
    } catch (error) {
      console.error("Error editing project:", error);
      res.status(500).json({ error: "Failed to edit project" });
    }
  }
);

app.put(
  "/settingGeneral",
  uploadMiddleware.single("files"),
  verifyTokens,
  async (req, res) => {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    try {
      const { id, location, timePeriod, description } = req.body;
      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }
      await projectDoc.updateOne({
        $set: {
          "setting.location": location,
          "setting.timePeriod": timePeriod,
          "setting.description": description,
        },
        $push: {
          "setting.pictures": newPath,
        },
      });

      res.json(projectDoc);
    } catch (error) {
      console.error("Error editing setting:", error);
      res.status(500).json({ error: "Failed to edit setting" });
    }
  }
);

app.put("/createCountry", verifyTokens, async (req, res) => {
  try {
    const { countryName, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await projectDoc.updateOne({
      $push: {
        "setting.countries": {
          name: countryName,
        },
      },
    });
    res.json(projectDoc);
  } catch (error) {
    console.error("Error create country:", error);
    res.status(500).json({ error: "Failed to create country" });
  }
});

app.get("/getCountryId/:id", verifyTokens, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    const { countries } = project.setting;
    recentCountry = countries[countries.length - 1];
    res.json(recentCountry);
  } catch (error) {
    console.error("Error fetching country:", error);
    res.status(500).json({ error: "Failed to fetch country" });
  }
});

app.put(
  "/updateCountry",
  verifyTokens,
  uploadMiddleware.single("files"),
  async (req, res) => {
    const { token } = req.cookies;
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    try {
      const {
        name,
        borders,
        capital,
        culture,
        economy,
        food,
        location,
        population,
        weather,
        wildlife,
        countryId,
        id,
      } = req.body;
      const landmarks = JSON.parse(req.body.landmarks);
      const cities = JSON.parse(req.body.cities);
      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }

      await projectDoc.updateOne(
        {
          $set: {
            "setting.countries.$[inner].name": name,
            "setting.countries.$[inner].borders": borders,
            "setting.countries.$[inner].capital": capital,
            "setting.countries.$[inner].culture": culture,
            "setting.countries.$[inner].economy": economy,
            "setting.countries.$[inner].food": food,
            "setting.countries.$[inner].location": location,
            "setting.countries.$[inner].population": population,
            "setting.countries.$[inner].weather": weather,
            "setting.countries.$[inner].wildlife": wildlife,
            "setting.countries.$[inner].cities": cities,
            "setting.countries.$[inner].landmarks": landmarks,
          },
        },
        { arrayFilters: [{ "inner._id": countryId }] }
      );

      if (newPath) {
        await projectDoc.updateOne(
          {
            $push: {
              "setting.countries.$[inner].pictures": newPath,
            },
          },
          { arrayFilters: [{ "inner._id": countryId }] }
        );
      }
      res.json(projectDoc);
    } catch (error) {
      console.error("Error editing country:", error);
      res.status(500).json({ error: "Failed to edit country" });
    }
  }
);

app.delete("/deleteCountry", verifyTokens, async (req, res) => {
  try {
    const { id, currentCountryId } = req.body;
    const project = await Project.findById(id);
    project.setting.countries.pull({ _id: currentCountryId });
    await project.save();
    res.json({ message: "Country deleted successfully", project });
  } catch (error) {
    console.error("Error deleting country:", error);
    res.status(404).json({ error: "Failed to delete country" });
  }
});

app.put("/createLand", verifyTokens, async (req, res) => {
  try {
    const { landName, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await projectDoc.updateOne({
      $push: {
        "setting.lands": {
          name: landName,
        },
      },
    });
    res.json(projectDoc);
  } catch (error) {
    console.error("Error creating land:", error);
    res.status(500).json({ error: "Failed to create land" });
  }
});

app.get("/getLandId/:id", verifyTokens, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    const { lands } = project.setting;
    recentLand = lands[lands.length - 1];
    res.json(recentLand);
  } catch (error) {
    console.error("Error fetching land:", error);
    res.status(500).json({ error: "Failed to fetch land" });
  }
});

app.put(
  "/updateLand",
  uploadMiddleware.single("files"),
  verifyTokens,
  async (req, res) => {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    try {
      const {
        name,
        description,
        terrain,
        location,
        weather,
        wildlife,
        landId,
        id,
      } = req.body;
      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }

      await projectDoc.updateOne(
        {
          $set: {
            "setting.lands.$[inner].name": name,
            "setting.lands.$[inner].description": description,
            "setting.lands.$[inner].terrain": terrain,
            "setting.lands.$[inner].location": location,
            "setting.lands.$[inner].weather": weather,
            "setting.lands.$[inner].wildlife": wildlife,
          },
        },
        { arrayFilters: [{ "inner._id": landId }] }
      );

      if (newPath) {
        await projectDoc.updateOne(
          {
            $push: {
              "setting.lands.$[inner].pictures": newPath,
            },
          },
          { arrayFilters: [{ "inner._id": landId }] }
        );
      }
      res.json(projectDoc);
    } catch (error) {
      console.error("Error editing land:", error);
      res.status(500).json({ error: "Failed to edit land" });
    }
  }
);

app.delete("/deleteLand", verifyTokens, async (req, res) => {
  try {
    const { id, currentLandId } = req.body;
    const project = await Project.findById(id);
    project.setting.lands.pull({ _id: currentLandId });
    await project.save();
    res.json({ message: "Land deleted successfully", project });
  } catch (error) {
    console.error("Error deleting land:", error);
    res.status(404).json({ error: "Failed to delete land" });
  }
});

app.put("/createBodyOfWater", verifyTokens, async (req, res) => {
  try {
    const { bodyOfWaterName, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await projectDoc.updateOne({
      $push: {
        "setting.bodiesOfWater": {
          name: bodyOfWaterName,
        },
      },
    });
    res.json(projectDoc);
  } catch (error) {
    console.error("Error creating body of water:", error);
    res.status(500).json({ error: "Failed to creating body of water" });
  }
});

app.get("/getBodyOfWaterId/:id", verifyTokens, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    const { bodiesOfWater } = project.setting;
    const recentWater = bodiesOfWater[bodiesOfWater.length - 1];
    res.json(recentWater);
  } catch (error) {
    console.error("Error fetching body of water:", error);
    res.status(500).json({ error: "Failed to fetch body of water" });
  }
});

app.put(
  "/updateBodyOfWater",
  uploadMiddleware.single("files"),
  verifyTokens,
  async (req, res) => {
    const { token } = req.cookies;
    console.log(req.file);
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    try {
      const { name, location, wildlife, description, size, id, bodyOfWaterId } =
        req.body;
      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }

      await projectDoc.updateOne(
        {
          $set: {
            "setting.bodiesOfWater.$[inner].name": name,
            "setting.bodiesOfWater.$[inner].location": location,
            "setting.bodiesOfWater.$[inner].wildlife": wildlife,
            "setting.bodiesOfWater.$[inner].description": description,
            "setting.bodiesOfWater.$[inner].size": size,
          },
        },
        { arrayFilters: [{ "inner._id": bodyOfWaterId }] }
      );
      if (newPath) {
        await projectDoc.updateOne(
          {
            $push: {
              "setting.bodiesOfWater.$[inner].pictures": newPath,
            },
          },
          { arrayFilters: [{ "inner._id": bodyOfWaterId }] }
        );
      }
      res.json(projectDoc);
    } catch (error) {
      console.error("Error editing body of water:", error);
      res.status(500).json({ error: "Failed to edit body of water" });
    }
  }
);

app.delete("/deleteBodyOfWater", verifyTokens, async (req, res) => {
  try {
    const { id, currentBodyOfWaterId } = req.body;
    const project = await Project.findById(id);
    project.setting.bodiesOfWater.pull({ _id: currentBodyOfWaterId });
    await project.save();
    res.json({ message: "Body of water deleted successfully", project });
  } catch (error) {
    console.error("Error deleting body of water:", error);
    res.status(404).json({ error: "Failed to delete body of water" });
  }
});

app.put("/createCharacter", verifyTokens, async (req, res) => {
  try {
    const { characterName, characterType, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    await projectDoc.updateOne({
      $push: {
        characters: {
          name: characterName,
          characterType: characterType,
        },
      },
    });
    res.json(projectDoc);
  } catch (error) {
    console.error("Error creating character:", error);
    res.status(500).json({ error: "Failed to create character" });
  }
});

app.get("/getCharacterId/:id", verifyTokens, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    const characters = project.characters;
    const recentCharacter = characters[characters.length - 1];
    res.json(recentCharacter);
  } catch (error) {
    console.error("Error fetching character:", error);
    res.status(500).json({ error: "Failed to fetch character" });
  }
});

app.put(
  "/updateCharacter",
  uploadMiddleware.single("files"),
  verifyTokens,
  async (req, res) => {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    try {
      const {
        name,
        abilities,
        birthDate,
        birthPlace,
        bodyType,
        clothes,
        characterType,
        childhood,
        criminalRecord,
        development,
        dreams,
        education,
        employment,
        eyesight,
        eyeColor,
        family,
        fears,
        gender,
        hairColor,
        hairstyle,
        handedness,
        height,
        hobbies,
        medicalHistory,
        moneyHabits,
        motivations,
        personality,
        pets,
        physicalDistinctions,
        relationships,
        romanticHistory,
        skills,
        strengths,
        voice,
        weaknesses,
        weight,
        characterId,
        id,
      } = req.body;

      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }

      await projectDoc.updateOne(
        {
          $set: {
            "characters.$[inner].name": name,
            "characters.$[inner].abilities": abilities,
            "characters.$[inner].birthPlace": birthPlace,
            "characters.$[inner].bodyType": bodyType,
            "characters.$[inner].clothes": clothes,
            "characters.$[inner].characterType": characterType,
            "characters.$[inner].childhood": childhood,
            "characters.$[inner].criminalRecord": criminalRecord,
            "characters.$[inner].development": development,
            "characters.$[inner].dreams": dreams,
            "characters.$[inner].education": education,
            "characters.$[inner].employment": employment,
            "characters.$[inner].eyesight": eyesight,
            "characters.$[inner].eyeColor": eyeColor,
            "characters.$[inner].family": family ? JSON.parse(family) : [],
            "characters.$[inner].fears": fears,
            "characters.$[inner].gender": gender,
            "characters.$[inner].hairColor": hairColor,
            "characters.$[inner].hairstyle": hairstyle,
            "characters.$[inner].handedness": handedness,
            "characters.$[inner].height": height,
            "characters.$[inner].hobbies": hobbies,
            "characters.$[inner].medicalHistory": medicalHistory,
            "characters.$[inner].moneyHabits": moneyHabits,
            "characters.$[inner].motivations": motivations,
            "characters.$[inner].personality": personality,
            "characters.$[inner].pets": pets,
            "characters.$[inner].physicalDistinctions": physicalDistinctions,
            "characters.$[inner].relationships": relationships,
            "characters.$[inner].romanticHistory": romanticHistory,
            "characters.$[inner].skills": skills,
            "characters.$[inner].strengths": strengths,
            "characters.$[inner].voice": voice,
            "characters.$[inner].weaknesses": weaknesses,
            "characters.$[inner].weight": weight,
          },
        },
        {
          arrayFilters: [{ "inner._id": characterId }],
        }
      );
      if (birthDate != "undefined") {
        await projectDoc.updateOne(
          {
            $set: {
              "characters.$[inner].birthDate": birthDate,
            },
          },
          {
            arrayFilters: [{ "inner._id": characterId }],
          }
        );
      }

      if (newPath) {
        await projectDoc.updateOne(
          {
            $set: {
              "characters.$[inner].picture": newPath,
            },
          },
          {
            arrayFilters: [{ "inner._id": characterId }],
          }
        );
      }
      res.json(projectDoc);
      console.log(projectDoc);
    } catch (error) {
      console.error("Error editing character:", error);
      res.status(500).json({ error: "Failed to edit character" });
    }
  }
);

app.delete("/deleteCharacter", verifyTokens, async (req, res) => {
  try {
    const { id, currentCharacterId } = req.body;
    const project = await Project.findById(id);
    project.characters.pull({ _id: currentCharacterId });
    await project.save();
    res.json({ message: "Character deleted successfully", project });
  } catch (error) {
    console.error("Error deleting character:", error);
    res.status(404).json({ error: "Failed to delete character" });
  }
});

app.put("/createGroup", verifyTokens, async (req, res) => {
  try {
    const { groupName, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    await projectDoc.updateOne({
      $push: {
        groups: {
          name: groupName,
        },
      },
    });
    res.json(projectDoc);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Failed to create group" });
  }
});

app.get("/getGroupId/:id", verifyTokens, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    const groups = project.groups;
    const recentGroup = groups[groups.length - 1];
    res.json(recentGroup);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ error: "Failed to fetch group" });
  }
});

app.put(
  "/updateGroup",
  uploadMiddleware.single("files"),
  verifyTokens,
  async (req, res) => {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    try {
      const {
        name,
        business,
        capital,
        connections,
        description,
        established,
        location,
        notableMembers,
        size,
        id,
        groupId,
      } = req.body;

      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }

      await projectDoc.updateOne(
        {
          $set: {
            "groups.$[inner].name": name,
            "groups.$[inner].business": business,
            "groups.$[inner].capital": capital,
            "groups.$[inner].connections": connections,
            "groups.$[inner].description": description,
            "groups.$[inner].location": location,
            "groups.$[inner].notableMembers": notableMembers,
            "groups.$[inner].size": size,
          },
        },
        {
          arrayFilters: [{ "inner._id": groupId }],
        }
      );

      if (newPath) {
        console.log(newPath);
        await projectDoc.updateOne(
          {
            $push: {
              "groups.$[inner].pictures": newPath,
            },
          },
          {
            arrayFilters: [{ "inner._id": groupId }],
          }
        );
      }

      if (established != "undefined") {
        await projectDoc.updateOne(
          {
            $set: {
              "groups.$[inner].established": established,
            },
          },
          {
            arrayFilters: [{ "inner._id": groupId }],
          }
        );
      }
      res.json(projectDoc);
      console.log(projectDoc.groups);
    } catch (error) {
      console.error("Error editing group:", error);
      res.status(500).json({ error: "Failed to edit group" });
    }
  }
);

app.delete("/deleteGroup", verifyTokens, async (req, res) => {
  try {
    const { id, currentGroupId } = req.body;
    const project = await Project.findById(id);
    project.groups.pull({ _id: currentGroupId });
    await project.save();
    res.json({ message: "Group deleted successfully", project });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(404).json({ error: "Failed to delete group" });
  }
});

app.put(
  "/updateThemes",
  uploadMiddleware.single("files"),
  verifyTokens,
  async (req, res) => {
    try {
      const { primary, secondary, id } = req.body;
      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }

      await projectDoc.updateOne({
        $set: {
          "themes.primary": primary ? JSON.parse(primary) : {},
          "themes.secondary": secondary ? JSON.parse(secondary) : [],
        },
      });
      res.json(projectDoc);
    } catch (error) {
      console.error("Error editing themes:", error);
      res.status(500).json({ error: "Failed to edit themes" });
    }
  }
);

app.put("/createArc", verifyTokens, async (req, res) => {
  try {
    const { arcName, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    await projectDoc.updateOne({
      $push: {
        "plot.arcs": {
          name: arcName,
        },
      },
    });
    res.json(projectDoc);
  } catch (error) {
    console.error("Error creating arc:", error);
    res.status(500).json({ error: "Failed to create arc" });
  }
});

app.get("/getArcId/:id", verifyTokens, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    const arcs = project.plot.arcs;
    const recentArc = arcs[arcs.length - 1];
    res.json(recentArc);
  } catch (error) {
    console.error("Error fetching Arc:", error);
    res.status(500).json({ error: "Failed to fetch Arc" });
  }
});

app.put(
  "/updateArc",
  uploadMiddleware.single("files"),
  verifyTokens,
  async (req, res) => {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }
    try {
      const {
        name,
        arcId,
        chapters,
        foreshadowing,
        twists,
        characterDevelopment,
        introduction,
        development,
        resolution,
        id,
      } = req.body;
      const protagonists = JSON.parse(req.body.protagonists);
      const antagonists = JSON.parse(req.body.antagonists);
      const tertiary = JSON.parse(req.body.tertiary);
      const obstacles = JSON.parse(req.body.obstacles);
      const subplots = JSON.parse(req.body.subplots);

      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }

      await Project.findOneAndUpdate(
        {
          "plot.arcs._id": arcId,
        },
        {
          $set: {
            "plot.arcs.$.name": name,
            "plot.arcs.$.chapters": chapters,
            "plot.arcs.$.foreshadowing": foreshadowing,
            "plot.arcs.$.twists": twists,
            "plot.arcs.$.characterDevelopment": characterDevelopment,
            "plot.arcs.$.introduction": introduction,
            "plot.arcs.$.development": development,
            "plot.arcs.$.resolution": resolution,
            "plot.arcs.$.protagonists": protagonists,
            "plot.arcs.$.antagonists": antagonists,
            "plot.arcs.$.tertiary": tertiary,
            "plot.arcs.$.obstacles": obstacles,
            "plot.arcs.$.subplots": subplots,
          },
        },
        { new: true }
      );
      if (newPath) {
        console.log(newPath);
        await projectDoc.updateOne(
          {
            $set: {
              "plot.arcs.$[inner].picture": newPath,
            },
          },
          {
            arrayFilters: [{ "inner._id": arcId }],
          }
        );
      }
      res.json(projectDoc);
      console.log(projectDoc.plot.arcs);
    } catch (error) {
      console.error("Error editing group:", error);
      res.status(500).json({ error: "Failed to edit group" });
    }
  }
);

app.delete("/deleteArc", verifyTokens, async (req, res) => {
  try {
    const { id, currentArcId } = req.body;
    const project = await Project.findById(id);
    project.plot.arcs.pull({ _id: currentArcId });
    await project.save();
    res.json({ message: "Arc deleted successfully", project });
  } catch (error) {
    console.error("Error deleting arc:", error);
    res.status(404).json({ error: "Failed to delete arc" });
  }
});

app.put("/createChapter", verifyTokens, async (req, res) => {
  try {
    const { title, id } = req.body;
    const chapterNumber = Number(req.body.chapterNumber);
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    await projectDoc.updateOne({
      $push: {
        "write.chapters": {
          $each: [
            {
              title,
              chapterNumber: chapterNumber,
              content: "And the story continues...",
              timestamp: new Date(),
            },
          ],
          $sort: {
            chapterNumber: 1,
          },
        },
      },
    });

    res.json(projectDoc);
  } catch (error) {
    console.error("Error creating chapter:", error);
    res.status(500).json({ error: "Failed to create chapter" });
  }
});

app.get("/getChapterId/:id", verifyTokens, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    const chapters = project.write.chapters;

    // Sort the chapters based on the timestamp in descending order
    const sortedChapters = chapters.sort((a, b) => b.timestamp - a.timestamp);

    // Get the most recent chapter
    const recentChapter = sortedChapters[0];

    res.json(recentChapter);
  } catch (error) {
    console.error("Error fetching chapter:", error);
    res.status(500).json({ error: "Failed to fetch chapter" });
  }
});

app.put(
  "/updateChapter",
  uploadMiddleware.single("file"),
  verifyTokens,
  async (req, res) => {
    try {
      const { title, id, content, chapterId } = req.body;

      const chapterNumber = Number(req.body.chapterNumber);
      console.log(title, chapterNumber);
      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }

      await projectDoc.updateOne(
        {
          $set: {
            "write.chapters.$[inner].title": title,
            "write.chapters.$[inner].chapterNumber": chapterNumber,
            "write.chapters.$[inner].content": content,
          },
        },
        {
          arrayFilters: [{ "inner._id": chapterId }],
        }
      );
      await projectDoc.updateOne({
        $push: {
          "write.chapters": {
            $each: [],
            $sort: {
              chapterNumber: 1,
            },
          },
        },
      });
      res.json(projectDoc);
    } catch (error) {
      console.error("Error editing chapter:", error);
      res.status(500).json({ error: "Failed to edit chapter" });
    }
  }
);

app.delete("/deleteChapter", verifyTokens, async (req, res) => {
  try {
    const { id, currentChapterId } = req.body;
    const project = await Project.findById(id);
    project.write.chapters.pull({ _id: currentChapterId });
    await project.save();
    res.json({ message: "Chapter deleted successfully", project });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    res.status(404).json({ error: "Failed to delete chapter" });
  }
});

app.put(
  "/updateEpilogue",
  uploadMiddleware.single(""),
  verifyTokens,
  async (req, res) => {
    try {
      console.log(req.body);
      const { epilogue, id } = req.body;
      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }

      await projectDoc.updateOne({
        $set: {
          "write.epilogue": epilogue,
        },
      });
      res.json(projectDoc);
    } catch (error) {
      console.error("Error editing epilogue:", error);
      res.status(500).json({ error: "Failed to edit epilogue" });
    }
  }
);

app.put(
  "/updatePrologue",
  verifyTokens,
  uploadMiddleware.single(""),
  async (req, res) => {
    try {
      console.log(req.body);
      const { prologue, id } = req.body;
      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(req.user.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }

      await projectDoc.updateOne({
        $set: {
          "write.prologue": prologue,
        },
      });
      res.json(projectDoc);
    } catch (error) {
      console.error("Error editing prologue:", error);
      res.status(500).json({ error: "Failed to edit prologue" });
    }
  }
);

app.post("/createNewNote", verifyTokens, async (req, res) => {
  try {
    const { title } = req.body;
    const noteDoc = await Note.create({
      title,
      createdBy: req.user.id,
      content: "Jot down some thoughts and ideas...",
    });
    res.json(noteDoc);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

app.get("/getUserNotes", verifyTokens, async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.put("/updateNote", verifyTokens, async (req, res) => {
  try {
    const { title, content, currentNoteId } = req.body;
    const noteDoc = await Note.findById(currentNoteId);
    await noteDoc.updateOne({
      title,
      content,
    });
    res.json(noteDoc);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

app.delete("/deleteNote", verifyTokens, async (req, res) => {
  try {
    const { currentNoteId } = req.body;
    await Note.findByIdAndDelete(currentNoteId);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(404).json({ error: "Failed to delete note" });
  }
});

app.get("/getUserInfo", verifyTokens, async (req, res) => {
  try {
    const userInfo = await UserInfo.findOne({ user_id: req.user.id });
    res.json(userInfo);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Failed to fetch user info" });
  }
});

app.put(
  "/updateUserInfo",
  uploadMiddleware.single("file"),
  verifyTokens,
  async (req, res) => {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    try {
      const { id } = req.body;
      const data = req.body;
      const userInfo = await UserInfo.findById(id);
      await userInfo.updateOne({
        name: data.name,
        profilePicture: newPath ? newPath : userInfo.profilePicture,
        bio: data.bio,
        experience: data.experience,
        favoriteBooks: data.favoriteBooks,
        favoriteAuthors: data.favoriteAuthors,
        favoriteGenre: data.favoriteGenre,
        goals: data.goals,
        "socialMediaLinks.instagram": data.instagram,
        "socialMediaLinks.facebook": data.facebook,
        "socialMediaLinks.pinterest": data.pinterest,
        "socialMediaLinks.twitter": data.twitter,
        "socialMediaLinks.tiktok": data.tiktok,
      });

      res.json(userInfo);
      console.log(userInfo);
    } catch (error) {
      console.error("Error editing user profile:", error);
      res.status(500).json({ error: "Failed to edit user profile" });
    }
  }
);

app.post("/chatbot", verifyTokens, async (req, res) => {
  try {
    const { updatedChat } = req.body;
    let chatHistory = updatedChat;
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // Specify the model you want to use if needed
        messages: chatHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
          instructions: {
            // Instructions for the chatbot
            intent:
              "Help the user to brainstorm for writing their next story, manga, play-write, or movie script",
          },
        })),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIAPIKey}`,
        },
      }
    );

    const botResponse = await response.data.choices[0].message.content;
    console.log(botResponse);
    res.json(botResponse);
  } catch (error) {
    console.error("Error getting response:", error);
    res.status(500).json({ error: "Failed to get response" });
  }
});

app.post("/saveChat", verifyTokens, async (req, res) => {
  try {
    const { title, content, currentChat } = req.body;
    const noteDoc = await Note.create({
      title,
      createdBy: req.user.id,
      content,
    });
    //const chatDoc = await BrainstormChat.create;
    res.json(noteDoc);
    console.log(noteDoc);
  } catch (error) {
    console.error("Error saving chat:", error);
    res.status(500).json({ error: "Failed to save chat" });
  }
});

app.listen(5000);
