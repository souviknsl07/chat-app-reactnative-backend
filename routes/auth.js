import express from "express";
import User from "../model/User.js";
import { registerValidation, loginValidation } from "../model/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "redis";

const router = express.Router();
const redisClient = redis.createClient();

router.post("/register", async (req, res) => {
  //validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  //check if the email exists
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).json("Email already exists");

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password,
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

const handleLogin = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  //check if the user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json("Email or Password is incorrect");

  // check if the password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword)
    return User.findOne({ email: req.body.email })
      .then((user) => user)
      .catch((err) => res.json("no email or password"));
  else {
    res.json("wrong email or password");
  }
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json("Unauthorized");
    }
    return res.json({ _id: JSON.parse(reply) });
  });
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.TOKEN_SECRET, {
    expiresIn: "2 days",
  });
};

const setToken = (key, value) => {
  return Promise.resolve(
    redisClient.set(key, JSON.stringify(value), redis.print)
  );
};

const createSession = (user) => {
  // JWT token, return user data
  const { email, _id } = user;
  const token = signToken(email);
  return setToken(token, _id)
    .then(() => {
      return { success: "true", userId: _id, token };
    })
    .catch(console.log);
};

router.post("/login", (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
    : handleLogin(req, res)
        .then((data) => {
          return data._id && data.email
            ? createSession(data)
            : Promise.reject(data);
        })
        .then((session) => res.json(session))
        .catch((err) => res.status(400).status(err));
});

export { router, redisClient };
