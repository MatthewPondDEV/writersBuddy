const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const User = require("./models/User");
const Project = require("./models/Project");
const Note = require("./models/Note");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
const key = process.env.MDB_API_KEY;

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
  `mongodb+srv://mattypond00:${key}@cluster0.32pnilj.mongodb.net/WritersBuddy?retryWrites=true&w=majority`
);

app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  console.log(req.body);
  try {
    const userDoc = await User.create({
      email,
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    //logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) res.json(null);
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json();
});

app.get("/getProjects", async (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const projects = await Project.find({ createdBy: info.id });
    const userProjects = projects.map((project) => ({
      _id: project._id,
      title: project.title,
      createdBy: project.createdBy,
    }));
    res.json(userProjects);
  });
});

app.post("/createProject", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title } = req.body;
    const projectDoc = await Project.create({
      title,
      createdBy: info.id,
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
    console.log(projectDoc);
    res.json(projectDoc);
  });
});

app.get("/getProjectID", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.find({ createdBy: info.id })
      .limit(1)
      .sort({ $natural: -1 });
    res.json(project);
  });
});

app.get("/project/:id", async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  res.json(project);
});

app.put(
  "/projectOverview",
  uploadMiddleware.single("file"),
  async (req, res) => {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id, title, summary, genre, author } = req.body;
      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
    });
  }
);

app.put(
  "/settingGeneral",
  uploadMiddleware.single("files"),
  async (req, res) => {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id, location, timePeriod, description } = req.body;
      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
    });
  }
);

app.put("/createCountry", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { countryName, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
  });
});

app.get("/getCountryId/:id", async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    const { countries } = project.setting;
    recentCountry = countries[countries.length - 1];
    res.json(recentCountry);
  });
});

app.put(
  "/updateCountry",
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

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
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
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
    });
  }
);

app.delete("/deleteCountry", async (req, res) => {
  const { token } = req.cookies;
  const { id, currentCountryId } = req.body;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    project.setting.countries.pull({ _id: currentCountryId });
    await project.save();
    res.json({ message: "Country deleted successfully", project });
  });
});

app.put("/createLand", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { landName, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
  });
});

app.get("/getLandId/:id", async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    const { lands } = project.setting;
    recentLand = lands[lands.length - 1];
    res.json(recentLand);
  });
});

app.put("/updateLand", uploadMiddleware.single("files"), async (req, res) => {
  const { token } = req.cookies;
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
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
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
  });
});

app.delete("/deleteLand", async (req, res) => {
  const { token } = req.cookies;
  const { id, currentLandId } = req.body;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    project.setting.lands.pull({ _id: currentLandId });
    await project.save();
    res.json({ message: "Land deleted successfully", project });
  });
});

app.put("/createBodyOfWater", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { bodyOfWaterName, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
  });
});

app.get("/getBodyOfWaterId/:id", async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    const { bodiesOfWater } = project.setting;
    const recentWater = bodiesOfWater[bodiesOfWater.length - 1];
    res.json(recentWater);
  });
});

app.put(
  "/updateBodyOfWater",
  uploadMiddleware.single("files"),
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

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { name, location, wildlife, description, size, id, bodyOfWaterId } =
        req.body;
      const projectDoc = await Project.findById(id);
      const isAuthor =
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
    });
  }
);

app.delete("/deleteBodyOfWater", async (req, res) => {
  const { token } = req.cookies;
  const { id, currentBodyOfWaterId } = req.body;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    project.setting.bodiesOfWater.pull({ _id: currentBodyOfWaterId });
    await project.save();
    res.json({ message: "Body of water deleted successfully", project });
  });
});

app.put("/createCharacter", async (req, res) => {
  const { token } = req.cookies;
  console.log(req.body);
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { characterName, characterType, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
  });
});

app.get("/getCharacterId/:id", async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    const characters = project.characters;
    const recentCharacter = characters[characters.length - 1];
    res.json(recentCharacter);
  });
});

app.put(
  "/updateCharacter",
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

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
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
        JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
      console.log(birthDate);
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
    });
  }
);

app.delete("/deleteCharacter", async (req, res) => {
  const { token } = req.cookies;
  const { id, currentCharacterId } = req.body;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    project.characters.pull({ _id: currentCharacterId });
    await project.save();
    res.json({ message: "Character deleted successfully", project });
  });
});

app.put("/createGroup", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { groupName, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
  });
});

app.get("/getGroupId/:id", async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    const groups = project.groups;
    const recentGroup = groups[groups.length - 1];
    res.json(recentGroup);
  });
});

app.put("/updateGroup", uploadMiddleware.single("files"), async (req, res) => {
  const { token } = req.cookies;

  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
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
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
  });
});

app.delete("/deleteGroup", async (req, res) => {
  const { token } = req.cookies;
  const { id, currentGroupId } = req.body;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    project.groups.pull({ _id: currentGroupId });
    await project.save();
    res.json({ message: "Group deleted successfully", project });
  });
});

app.put("/updateThemes", uploadMiddleware.single("files"), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { primary, secondary, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
  });
});

app.put("/createArc", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { arcName, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
  });
});

app.get("/getArcId/:id", async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    const arcs = project.plot.arcs;
    const recentArc = arcs[arcs.length - 1];
    res.json(recentArc);
  });
});

app.put("/updateArc", uploadMiddleware.single("files"), async (req, res) => {
  const { token } = req.cookies;

  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
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
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
  });
});

app.delete("/deleteArc", async (req, res) => {
  const { token } = req.cookies;
  const { id, currentArcId } = req.body;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    project.plot.arcs.pull({ _id: currentArcId });
    await project.save();
    res.json({ message: "Arc deleted successfully", project });
  });
});

app.put("/createChapter", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, id } = req.body;
    const chapterNumber = Number(req.body.chapterNumber);
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
  });
});

app.get("/getChapterId/:id", async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    const chapters = project.write.chapters;

    // Sort the chapters based on the timestamp in descending order
    const sortedChapters = chapters.sort((a, b) => b.timestamp - a.timestamp);

    // Get the most recent chapter
    const recentChapter = sortedChapters[0];

    res.json(recentChapter);
  });
});

app.put("/updateChapter", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, id, content, chapterId } = req.body;

    const chapterNumber = Number(req.body.chapterNumber);
    console.log(title, chapterNumber);
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
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
  });
});

app.delete("/deleteChapter", async (req, res) => {
  const { token } = req.cookies;
  const { id, currentChapterId } = req.body;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const project = await Project.findById(id);
    project.write.chapters.pull({ _id: currentChapterId });
    await project.save();
    res.json({ message: "Chapter deleted successfully", project });
  });
});

app.put("/updateEpilogue", uploadMiddleware.single(""), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    console.log(req.body);
    const { epilogue, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    await projectDoc.updateOne({
      $set: {
        "write.epilogue": epilogue,
      },
    });
    console.log(projectDoc.write.epilogue);
    res.json(projectDoc);
  });
});

app.put("/updatePrologue", uploadMiddleware.single(""), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    console.log(req.body);
    const { prologue, id } = req.body;
    const projectDoc = await Project.findById(id);
    const isAuthor =
      JSON.stringify(projectDoc.createdBy) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    await projectDoc.updateOne({
      $set: {
        "write.prologue": prologue,
      },
    });
    res.json(projectDoc);
  });
});

app.post("/createNewNote", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title } = req.body;
    const noteDoc = await Note.create({
      title,
      createdBy: info.id,
    });
    console.log(noteDoc);
    res.json(noteDoc);
  });
});

app.get("/getUserNotes", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    const notes = await Note.find({ createdBy: info.id });
    res.json(notes);
  });
});

app.put("/updateNote", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, content, currentNoteId } = req.body;
    const noteDoc = await Note.findById(currentNoteId);
    await noteDoc.updateOne({
      title,
      content,
    });
    res.json(noteDoc);
  });
});

app.delete("/deleteNote", async (req, res) => {
  const { token } = req.cookies;
  const { currentNoteId } = req.body;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const note = await Note.findByIdAndRemove(currentNoteId);
    res.json({ message: "Note deleted successfully" });
  });
});

app.listen(5000);
