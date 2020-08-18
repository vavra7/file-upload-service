export enum ErrorCode {
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  IncorrectImageFormat = 'INCORRECT_IMAGE_FORMAT',
  ImageNotFound = 'IMAGE_NOT_FOUND',
  ListingNotFound = 'LISTING_NOT_FOUND',
  InvalidInput = 'INVALID_INPUT'
}

class ApiError extends Error {
  public errorCode: ErrorCode;
  public message: string;
  public extensions: object;

  constructor(errorCode: ErrorCode, message: string, extensions: object = {}) {
    super();

    this.errorCode = errorCode;
    this.message = message;
    this.extensions = extensions;
  }

  public getStatusCode(): number {
    switch (this.errorCode) {
      case ErrorCode.InvalidInput:
        return 400;
      case ErrorCode.ImageNotFound:
      case ErrorCode.ListingNotFound:
        return 404;
      case ErrorCode.IncorrectImageFormat:
        return 415;
      default:
        return 500;
    }
  }
}

export default ApiError;
