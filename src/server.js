import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import {
  getContactsController,
  getContactByIdController,
} from './controllers/contacts.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pinoHttp());

  app.get('/contacts', getContactsController);
  app.get('/contacts/:contactId', getContactByIdController);

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return app;
};
