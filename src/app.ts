import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import * as middlewares from "./middlewares";
import MessageResponse from "./interfaces/MessageResponse";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./interfaces/ISocket";

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server<ServerToClientEvents, ClientToServerEvents>(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} user just connected`);
  socket.on("disconnect", () => {
    console.log("user just disconnected");
  });
});

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default httpServer;
