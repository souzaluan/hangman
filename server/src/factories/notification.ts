import { NotificationType } from '../constants';
import { NotificationResponse } from '../responses';

class NotificationFactory implements NotificationResponse {
  constructor(
    readonly type: NotificationType,
    readonly message: string
  ) {}
}

export default NotificationFactory;
