import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Button, Typography, Box, Card, CardContent, Divider
} from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { KeycloakContext } from './keycloak-provider';

const Account = () => {
  const { keycloak, logout } = useContext(KeycloakContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleChangePassword = () => {
    if (keycloak) {
      keycloak.accountManagement();
    }
  };

  // Get user info
  const username = keycloak?.tokenParsed?.preferred_username || 'Unknown';
  const email = keycloak?.tokenParsed?.email || 'Unknown';
  const allowedRoles = ['Admin', 'User', 'SecurityAnalyst', 'RegulatoryBodies'];
  const allRoles = keycloak?.tokenParsed?.realm_access?.roles || [];
  
  // Only keep allowed roles
  const roles = allRoles.filter(role => allowedRoles.includes(role));
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Account Information
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body1"><strong>Username:</strong> {username}</Typography>
                <Typography variant="body1"><strong>Email:</strong> {email}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Roles:</strong> {roles.length > 0 ? roles.join(', ') : 'None'}
                </Typography>

                <Box mt={4}>
                  <Button variant="contained" color="error" onClick={handleChangePassword} sx={{ mr: 2 }}>
                    Change Password
                  </Button>
                  <Button variant="contained" color="error" onClick={handleLogout}>
                    Logout
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default Account;
