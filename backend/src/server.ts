import express from 'express';
import path from 'path';
import 'express-async-errors';

import './database/connection';

import routes from './routes';
import errorHandle from './errors/handle';

const PORT = 3333;

const app = express();

app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(errorHandle);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
