export enum ErrorCode {
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  IncorrectImageFormat = 'INCORRECT_IMAGE_FORMAT'
}

class ApiError extends Error {
  public errorCode: ErrorCode;
  public message: string;

  constructor(errorCode: ErrorCode, message: string) {
    super();

    this.errorCode = errorCode;
    this.message = message;
  }

  public getStatusCode(): number {
    switch (this.errorCode) {
      case ErrorCode.IncorrectImageFormat:
        return 415;
      default:
        return 500;
    }
  }
}

export default ApiError;
