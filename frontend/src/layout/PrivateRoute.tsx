import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAllowed }: { isAllowed: boolean }) => {
  return isAllowed ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
