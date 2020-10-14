import express from 'express';
import path from 'path';
import './database/connection';

import routes from './routes';

const PORT = 3333;

const app = express();

app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
