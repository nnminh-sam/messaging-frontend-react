import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthenticationProvider";

const PrivateRoute = () => {
  const authContext: any = useAuth();
  if (!authContext.accessToken) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;
