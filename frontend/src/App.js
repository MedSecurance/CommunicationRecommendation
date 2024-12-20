import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import AuthenticatedLayout from "./AuthenticatedLayout";
import UnauthenticatedLayout from "./UnauthenticatedLayout";
import Account from "./Account"; // Import the Account component

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
              <PrivateRoute>
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
      <AuthProvider>
        <Routes>
          <Route element={<UnauthenticatedLayout theme={darkMode ? themeDarkRTL : themeRTL} />}>
            <Route path="/login" element={<Login />} />
          </Route>
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
                routes={routes} // Pass routes as a prop
              />
            }
          >
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/riskassessment" />} />
          </Route>
        </Routes>
      </AuthProvider>
    </CacheProvider>
  ) : (
    <AuthProvider>
      <Routes>
        <Route element={<UnauthenticatedLayout theme={darkMode ? themeDark : theme} />}>
          <Route path="/login" element={<Login />} />
        </Route>
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
              routes={routes} // Pass routes as a prop
            />
          }
        >
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/riskassessment" />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
