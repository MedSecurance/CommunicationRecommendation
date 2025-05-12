import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { KeycloakContext } from "./keycloak-provider";

const PrivateRoute = ({ children, requiredRoles }) => {
  const { authenticated, roles } = useContext(KeycloakContext);

  const hasRequiredRole = requiredRoles
    ? requiredRoles.some((role) => roles.includes(role))
    : true;

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
