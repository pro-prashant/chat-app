import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthDataContext } from "./authContext";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const auth = useContext(AuthDataContext);

  // Wait while fetching user info
  if (auth.loading) {
    return <div className="text-center mt-20 text-white">Loading...</div>;
  }

  // If not logged in → redirect to login
  if (!auth.updateProfile) {
    return <Navigate to="/login" replace />;
  }

  // If logged in → allow access
  return children;
};

export default PrivateRoute;
