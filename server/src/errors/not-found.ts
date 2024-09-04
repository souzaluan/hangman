import { ErrorType } from '../constants';
import { ErrorResponse } from '../responses';

class NotFoundError implements ErrorResponse {
  readonly type = ErrorType.NotFound;
}

export default NotFoundError;
