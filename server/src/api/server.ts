import express, { Request, Response } from 'express';
//add routes here...
import publicRoute from './test/public';
import privateRoute from './test/private';
import survey from './survey/routes';
import auth from './auth/routes';
import users from './users/routes';
import chats from './chats/routes';
import messages from './messages/routes';
import notifications from './notifications/routes';
import listings from './listings/routes';
import matches from './matches/routes';
import bodyParser from 'body-parser';
import { startSocketIO } from './websockets';
import { Socket } from 'socket.io';

const port = process.env.PORT || 8080;
const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
const cors = require('cors');
app.use(cors());

app.use((req, res, next) => {
  // allow calling from different domains
  res.set('Access-Control-Allow-Origin', '*');
  // allow authorization header
  res.set('Access-Control-Allow-Headers', 'authorization');
  next();
});

app.get('/', (req: Request, res: Response) => {
  console.log('/');
  // res.set("Access-Control-Allow-Origin", "*");
  res.json({ BRUH: 'IP ADDRESS LOGGED AND REPORTED TO ADMIN' });
});

// middleware
app.use(express.json());

//use routes here
app.use(publicRoute);
app.use(privateRoute);
app.use('/auth', auth);
app.use('/users', users);
app.use('/chats', chats);
app.use('/messages', messages);
app.use('/notifications', notifications);
app.use('/listings', listings);
app.use('/survey', survey);
app.use('/matches', matches);
// Start the express server.
const server = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

startSocketIO(server);
