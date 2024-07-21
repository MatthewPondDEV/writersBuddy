const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const cookieParser = require("cookie-parser");

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());