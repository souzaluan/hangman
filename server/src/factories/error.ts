import { ErrorType } from '../constants';
import { ErrorResponse } from '../responses';

class ErrorFactory implements ErrorResponse {
  constructor(readonly type: ErrorType) {}
}

export default ErrorFactory;
