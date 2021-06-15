import { Router } from "express";
import Chat from "../model/Chat.js";
import User from "../model/User.js";

const router = Router();

router.post("/:id", async (req, res) => {
  const { id } = req.params;

  const chat = new Chat({
    chatName: req.body.chatName,
  });

  await User.findOne({ _id: id }).then((user) => {
    if (user) {
      try {
        const savedChat = chat.save();
        res.json(savedChat);
      } catch (err) {
        res.status(400).json(err);
      }
    }
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  await User.findById({ _id: id }).then((user) => {
    if (user) {
      Chat.find()
        .then((chats) => res.json(chats))
        .catch((err) => res.status(400).json(err));
    }
  });
});

export default router;
