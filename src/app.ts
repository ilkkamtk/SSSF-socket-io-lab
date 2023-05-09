import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import * as middlewares from './middlewares';
import MessageResponse from './interfaces/MessageResponse';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from './interfaces/ISocket';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`${socket.id} user just connected`);
  socket.on('disconnect', () => {
    console.log('user just disconnected');
  });
  socket.on('update', (data) => {
    console.log(data);
    if (data === 'animal') {
      socket.broadcast.emit('addAnimal', 'New animal added');
    } else if (data === 'species') {
      socket.broadcast.emit('addSpecies', 'New species added');
    }
  });
});

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'socket server is running',
  });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default httpServer;
