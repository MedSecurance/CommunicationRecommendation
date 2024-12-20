import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext'; // Assuming you have an AuthContext for managing authentication
import {
  Grid, Button, Typography, Box, Card, CardContent, Divider
} from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { GetDevices, DeleteDevice } from "services/device-manager-service";
import Icon from "@mui/material/Icon";

const Account = () => {

    const { logout } = useContext(AuthContext);

    const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePassword = () => {
    // Implement logic for changing password
    // Example: navigate to a change password page
    navigate('/change-password');
  };

  const handleAddUser = () => {
    // Implement logic for adding a user
    // Example: navigate to an add user page
    navigate('/add-user');
  };

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
                <Typography variant="body1" paragraph>
                  Display any relevant account information here.
                </Typography>
                {/* Add more details about the account if needed */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Manage Account
              </Typography>
              <Button variant="contained" color="white" onClick={handleChangePassword} sx={{ mr: 2 }}>
                Change Password
              </Button>
              <Button variant="contained" color="white" onClick={handleAddUser}>
                Add User
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Box mt={3}>
              <Button variant="contained" color="white" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default Account;
