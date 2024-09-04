import { NotificationResponse } from '../responses';
import { NotificationType } from '../constants';

class SuccessNotification implements NotificationResponse {
  readonly type = NotificationType.Success;

  constructor(readonly message: string) {}
}

export default SuccessNotification;
