import express from "express";
import User from "../model/User.js";

const router = express.Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;
  User.findOne({ _id: id })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(400).json("user not found");
      }
    })
    .catch((err) => res.status(400).json("not getting user"));
  // res.json({
  //   user: req.user,
  // });
});

export default router;
