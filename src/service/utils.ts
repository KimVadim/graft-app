import { NotificationType } from '../constants/appConstant';
import { NotificationInstance } from 'antd/es/notification/interface';

export const formatPhoneNumber = (phone: String) => {
  if (!phone) return '';
  return phone.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');
};

export const openNotification = (
  api: NotificationInstance,
  type: NotificationType,
  message: string,
  description?: string
) => {
  api[type]({
    message,
    duration: 2,
    description,
  });
};

export const formattedPhone = (phone: string) => {
  if (!phone) return '+7';

  // Убираем всё кроме цифр
  let digits = phone.replace(/\D/g, '');

  // Если уже 11 цифр и начинается с 7 — оставляем как есть
  if (digits.length === 11 && digits.startsWith('7')) {
    // ок
  } else if (digits.startsWith('8') && digits.length === 11) {
    digits = '7' + digits.slice(1);
  } else if (!digits.startsWith('7')) {
    digits = '7' + digits.slice(0, 10); // если меньше цифр — добавляем 7 в начало
  }

  // Обрезаем до 11 цифр
  digits = digits.slice(0, 11);

  // Форматируем красиво
  let formatted = '+7';
  if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
  if (digits.length >= 5) formatted += ') ' + digits.slice(4, 7);
  if (digits.length >= 8) formatted += '-' + digits.slice(7, 9);
  if (digits.length >= 10) formatted += '-' + digits.slice(9, 11);

  return formatted;
};
