import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Описываем пропсы компонента
interface PrivateRouteProps {
  allowedRoles?: string[];
  redirectPath?: string;
}

const PrivateRoute: FC<PrivateRouteProps> = ({
  allowedRoles,
  redirectPath = '/order'
}) => {
  // 1. Получаем данные пользователя
  const userString = localStorage.getItem('login');

  // 2. Если не авторизован — на логин
  if (!userString) {
    return <Navigate to="/login" replace />;
  }

  // 3. Проверка ролей
  // Если массив ролей передан, проверяем вхождение в него роли пользователя
  if (allowedRoles && !allowedRoles.includes(userString)) {
    return <Navigate to={redirectPath} replace />;
  }

  // 4. Если всё ок — рендерим дочерние элементы
  return <Outlet />;
};

export default PrivateRoute;