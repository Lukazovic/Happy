import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.log(error);

  return response
    .status(500)
    .json({ error: true, message: 'Internal Server Error' });
};

export default errorHandler;
