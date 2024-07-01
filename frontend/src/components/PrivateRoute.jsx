import { Navigate } from "react-router-dom";
import { useAuth } from "../providers";

export const PrivateRoute = ({ children }) => {
  const { authToken } = useAuth();

  return (
    <div>{authToken ? <>{children}</> : <Navigate replace to="/login" />}</div>
  );
};
