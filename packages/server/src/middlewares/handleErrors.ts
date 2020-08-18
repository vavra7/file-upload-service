import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';
import ApiError, { ErrorCode } from '../utils/ApiError';

interface IError {
  code: ErrorCode;
  message: string;
  extensions: {
    [key: string]: any;
    stacktrace: Array<string>;
  };
}

type TErrorRes = Array<IError>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleErrors = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
  if (err instanceof ApiError) {
    return res.status(err.getStatusCode()).json({
      errors: [
        {
          code: err.errorCode,
          message: err.message,
          extensions: {
            ...err.extensions,
            stacktrace: err.stack?.split('\n')
          }
        }
      ] as TErrorRes
    });
  } else if (err instanceof ValidationError) {
    const validationErrors: object[] = [];

    if (err.inner.length) {
      err.inner.forEach((item: any) => {
        validationErrors.push({
          path: item.path,
          type: item.type,
          value: item.value,
          errors: item.errors
        });
      });
    } else {
      validationErrors.push({
        path: err.path,
        type: err.type,
        value: (err as any).params.value,
        errors: err.errors
      });
    }

    return res.status(400).json({
      errors: [
        {
          code: ErrorCode.InvalidInput,
          message: err.message,
          extensions: {
            inner: validationErrors,
            stacktrace: err.stack?.split('\n')
          }
        }
      ] as TErrorRes
    });
  } else {
    console.error(err);

    return res.status(500).json({
      errors: [
        {
          code: ErrorCode.InternalServerError,
          message: err.message || 'Internal server error',
          extensions: {
            stacktrace: err.stack?.split('\n') || null
          }
        }
      ] as TErrorRes
    });
  }
};

export default handleErrors;
