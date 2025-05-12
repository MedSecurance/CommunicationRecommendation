import React, { createContext, useEffect, useState } from "react";
import keycloak from "./keycloak";

export const KeycloakContext = createContext();

export const KeycloakProvider = ({ children }) => {
  const [keycloakReady, setKeycloakReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);

  const refreshTokenIfNeeded = async () => {
    try {
      const refreshed = await keycloak.updateToken(30); // Refresh if token expires in 30 seconds
      if (refreshed) {
        console.log("Token refreshed successfully");
      }
    } catch (error) {
      console.error("Token refresh failed", error);
      if (authenticated) {  // Prevent redundant logout calls
        logout();
      }
    }
  };

  const getAuthHeaders = async () => {
    await refreshTokenIfNeeded();
    if (keycloak.token) {
      return {
        Authorization: `Bearer ${keycloak.token}`,
      };
    } else {
      return {};
    }
  };

  const logout = () => {
    keycloak.logout();
    setAuthenticated(false);
  };

  useEffect(() => {
    let isMounted = true;

    keycloak.init({ onLoad: "login-required" }).then((authenticated) => {
      if (authenticated && isMounted) {
        setAuthenticated(true);
        setKeycloakReady(true);
        setRoles(keycloak.realmAccess?.roles || []);

        keycloak.onTokenExpired = () => {
          if (isMounted) refreshTokenIfNeeded();
        };
      } else {
        console.warn("Not authenticated");
      }
    });

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, []);

  if (!keycloakReady) return <div>Loading...</div>;

  return (
    <KeycloakContext.Provider
      value={{
        keycloak,
        authenticated,
        roles,
        getAuthHeaders,
        logout,
      }}
    >
      {children}
    </KeycloakContext.Provider>
  );
};