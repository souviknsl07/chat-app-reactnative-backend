import express from "express";
import mongoose from "mongoose";
import "dotenv/config.js";
import { router } from "./routes/auth.js";
import profileRoute from "./routes/profile.js";
import chatRoute from "./routes/chatClient.js";
import chat from "./routes/chatControl.js";
import cors from "cors";
import verifyToken from "./routes/validateToken.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//middlewares
app.use("/api/user", router);
app.use("/api/profile", verifyToken, profileRoute);
app.use("/api/chats", verifyToken, chatRoute);
app.use("/api/chat", chat);
//db-connection
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => console.log("connected to db")
);

app.listen(port, () => console.log(`server running on ${port}`));
