import ApiError, { ErrorCode } from '../utils/errors';
import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleErrors = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
  if (err instanceof ApiError) {
    return res.status(err.getStatusCode()).json({
      errors: [
        {
          code: err.errorCode,
          message: err.message,
          extensions: {
            stacktrace: err.stack
          }
        }
      ]
    });
  } else {
    console.error(err);

    return res.status(500).json({
      errors: [
        {
          code: ErrorCode.InternalServerError,
          message: err.message || 'Internal server error',
          extensions: {
            stacktrace: err.stack || null
          }
        }
      ]
    });
  }
};

export default handleErrors;
