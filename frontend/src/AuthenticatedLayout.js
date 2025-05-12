import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

const AuthenticatedLayout = ({
  theme,
  darkMode,
  sidenavColor,
  transparentSidenav,
  whiteSidenav,
  layout,
  handleOnMouseEnter,
  handleOnMouseLeave,
  handleConfiguratorOpen,
  configsButton,
  routes, // Receive routes as a prop
}) => {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, openConfigurator } = controller;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Med Security Portal"
            routes={routes} // Use routes here
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Outlet />
    </ThemeProvider>
  );
};

export default AuthenticatedLayout;
