import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: "string",
    required: true,
    max: 255,
  },
  email: {
    type: "string",
    required: true,
    max: 255,
  },
  password: {
    type: "string",
    required: true,
    min: 6,
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
