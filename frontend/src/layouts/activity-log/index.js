import React, { useState, useEffect, useContext } from 'react';
import {
  Grid, Card, Typography
} from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { GetActivityLog } from "services/activity-log-service";
import { KeycloakContext } from '../../keycloak-provider';
import { hasPermission } from '../../authentication-helpers/role-validator';

const ActivityLog = () => {
  
  const { getAuthHeaders, roles } = useContext(KeycloakContext);
  
  const canDelete = hasPermission(roles, 'DeviceManager', 'delete');
  const canViewDetails = hasPermission(roles, 'DeviceManager', 'view');
  const canInsert = hasPermission(roles, 'DeviceManager', 'insert');

  const columns = [
    { Header: "User Id", accessor: "userId", align: "left" },
    { Header: "User Full Name", accessor: "userFullName", align: "left" },
    { Header: "Category", accessor: "category", align: "left" },
    { Header: "Action", accessor: "action", align: "left" },
    { Header: "Details", accessor: "details", align: "left" },
    { Header: "CreatedAt", accessor: "createdAt", align: "left" }
    ];

  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchData(getAuthHeaders);
  }, []);

  const fetchData = async (getAuthHeaders) => {
    try {

      const response = await GetActivityLog(getAuthHeaders);
      
      setRows(response.activityLogs.map(log => ({
        userId: (<Typography display="block" variant="caption" fontWeight="medium">{log.userId}</Typography>),
        userFullName: (<Typography display="block" variant="caption" fontWeight="medium">{log.userFullName}</Typography>),
        category: (<Typography display="block" variant="caption" fontWeight="medium">{log.category}</Typography>),
        action: (<Typography component="a" variant="caption" color="text" fontWeight="medium">{log.action}</Typography>),
        details: (<Typography
            display="block"
            variant="caption"
            fontWeight="medium"
            style={{ maxWidth: '250px', overflowX: 'auto', whiteSpace: 'nowrap' }}
          >
            {log.details}
          </Typography>
        ),
        createdAt: (<Typography component="a" variant="caption" color="text" fontWeight="medium">{log.createdAt}</Typography>)
      })));

    } 
    catch (error) {
    
      console.error('Error fetching data:', error);
    
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">Activity Log</MDTypography>
                </MDBox>
              </MDBox>
              <MDBox pt={3} sx={{ overflowX: 'auto' }}>
                <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={true} noEndBorder />
            </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default ActivityLog;
