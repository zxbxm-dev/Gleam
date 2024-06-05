import { Navigate, Outlet } from 'react-router-dom';

interface PublicRouteProps {
  isAllowed: boolean;
  redirectPath: string;
}

const PublicRoute = ({ isAllowed, redirectPath }: PublicRouteProps) => {
  return isAllowed ? <Navigate to={redirectPath} /> : <Outlet />;
};

export default PublicRoute;
