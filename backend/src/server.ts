import express from 'express';

import './database/connection';

const PORT = 3333;

const app = express();

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
