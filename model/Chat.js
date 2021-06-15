import mongoose from "mongoose";

const messagesSchema = mongoose.Schema({
  message: {
    type: "string",
    required: true,
  },
  displayName: {
    type: "string",
  },
  email: {
    type: "string",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = mongoose.Schema({
  chatName: {
    type: "string",
    required: true,
  },
  messages: [messagesSchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Chat", chatSchema);
