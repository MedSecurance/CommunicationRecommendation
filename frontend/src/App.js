import { useState, useEffect, useMemo, useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import PrivateRoute from "./PrivateRoute";
import AuthenticatedLayout from "./AuthenticatedLayout";
import { KeycloakContext } from "./keycloak-provider"; // Assuming this is your Keycloak context

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  const { keycloak } = useContext(KeycloakContext);

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const filterRoutesByRoles = (allRoutes, userRoles) => {
    return allRoutes.filter((route) => {
      if (route.roles && route.roles.length > 0) {
        return route.roles.some((role) => userRoles.includes(role));
      }
      return true; // If no roles are specified, the route is accessible by all authenticated users
    });
  };

  const getUserRoles = () => keycloak?.realmAccess?.roles || []; // Retrieve roles from Keycloak

  const filteredRoutes = filterRoutesByRoles(routes, getUserRoles());

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={
              <PrivateRoute requiredRoles={route.roles || []}>
                {route.component}
              </PrivateRoute>
            }
            key={route.key}
          />
        );
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <Routes>
        <Route
          element={
            <AuthenticatedLayout
              theme={darkMode ? themeDarkRTL : themeRTL}
              darkMode={darkMode}
              sidenavColor={sidenavColor}
              transparentSidenav={transparentSidenav}
              whiteSidenav={whiteSidenav}
              layout={layout}
              handleOnMouseEnter={handleOnMouseEnter}
              handleOnMouseLeave={handleOnMouseLeave}
              handleConfiguratorOpen={handleConfiguratorOpen}
              configsButton={configsButton}
              routes={filteredRoutes} // Pass filtered routes
            />
          }
        >
          {getRoutes(filteredRoutes)}
          <Route path="*" element={<Navigate to="/riskassessment" />} />
        </Route>
      </Routes>
    </CacheProvider>
  ) : (
    <Routes>
      <Route
        element={
          <AuthenticatedLayout
            theme={darkMode ? themeDark : theme}
            darkMode={darkMode}
            sidenavColor={sidenavColor}
            transparentSidenav={transparentSidenav}
            whiteSidenav={whiteSidenav}
            layout={layout}
            handleOnMouseEnter={handleOnMouseEnter}
            handleOnMouseLeave={handleOnMouseLeave}
            handleConfiguratorOpen={handleConfiguratorOpen}
            configsButton={configsButton}
            routes={filteredRoutes} // Pass filtered routes
          />
        }
      >
        {getRoutes(filteredRoutes)}
        <Route path="*" element={<Navigate to="/riskassessment" />} />
      </Route>
    </Routes>
  );
}
