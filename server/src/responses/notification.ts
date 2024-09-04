import { NotificationType } from '../constants';

interface NotificationResponse {
  type: NotificationType;
  message: string;
}

export default NotificationResponse;
