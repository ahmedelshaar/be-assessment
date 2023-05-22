import connectDB from './config/dbConfig.js';
import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { cronJob } from './services/cronJob.js';
import cors from 'cors';

import routes from './routes.js';

config();
connectDB();
cronJob.start();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
});
