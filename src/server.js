import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pinoHttp());
  app.use(express.json());
  app.use(cookieParser());

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return app;
};
