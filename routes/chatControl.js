import { Router } from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import Chat from "../model/Chat.js";

const pusher = new Pusher({
  appId: "1217570",
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "ap2",
  useTLS: true,
});

const router = Router();

router.post("/:id", (req, res) => {
  const { id } = req.params;
  Chat.updateOne(
    { _id: id },
    {
      $push: { messages: req.body },
    },
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    }
  );
});

mongoose.connection.once("open", () => {
  const changeStream = mongoose.connection.collection("chats").watch();
  changeStream.on("change", (change) => {
    console.log(change);

    if (change.operationType === "update") {
      console.log("triggering pusher");
      pusher.trigger("chats", "updated", {
        change: change,
      });
    } else {
      console.log("triggering pusher error");
    }
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Chat.findById(id)
    .then((data) => {
      data.messages.sort((a, b) => a.timestamp - b.timestamp);
      res.status(200).send(data.messages);
    })
    .catch((err) => res.status(400).send(err));
});

export default router;
