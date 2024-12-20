import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Card, Typography, Button, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { GetDevices, DeleteDevice } from "services/device-manager-service";
import Icon from "@mui/material/Icon";
import CreateDeviceDialog from "./components/create-device/index"
import { AuthContext } from '../../auth/AuthContext'; // Assuming you have an AuthContext for managing authentication

const DeviceManager = () => {


  const { getAuthHeaders } = useContext(AuthContext);

  const columns = [
    { Header: "Device Name", accessor: "name", align: "left" },
    { Header: "Connected Network Name", accessor: "networkName", align: "left" },
    { Header: "Description", accessor: "description", align: "left" },
    { Header: "action", accessor: "action", align: "right" }
  ]


  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal open/close

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deviceIdToDelete, setDeviceIdToDelete] = useState(null);


  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    fetchData(getAuthHeaders);
  }, []);

  const fetchData = async (getAuthHeaders) => {
    try {
      const response = await GetDevices(getAuthHeaders);
      // Update rows state with fetched data
      setRows(response.devices.map(device => ({
        name: (
          <Typography display="block" variant="caption" fontWeight="medium">
            {device.name}
          </Typography>
        ),
        networkName: (
          <Typography display="block" variant="caption" fontWeight="medium">
            {device.networkName}
          </Typography>
        ),
        description: (
          <Typography component="a" variant="caption" color="text" fontWeight="medium">
            {device.description}
          </Typography>
        ),
        action: (
          <><MDTypography onClick={() => HandleShowDetails(device.id)} component="a" href="#" color="text">
            <Icon>info</Icon>
          </MDTypography><MDTypography onClick={() => openDeleteDialog(device.id)} component="a" href="#" color="text">
              <Icon>delete</Icon>
            </MDTypography></>
        )

      })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const openDeleteDialog = (deviceId) => {
    setDeviceIdToDelete(deviceId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeviceIdToDelete(null);
  };

  const confirmDelete = async () => {
    if (deviceIdToDelete) {
      await DeleteDevice(deviceIdToDelete, getAuthHeaders);
      await fetchData(getAuthHeaders); // Refresh data after deletion
      closeDeleteDialog(); // Close the dialog after deletion
    }
  };

  // Render the delete confirmation dialog
  const renderDeleteDialog = () => (
    <Dialog
      open={deleteDialogOpen}
      onClose={closeDeleteDialog}
    >
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this device? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={confirmDelete} color="secondary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );


  const HandleShowDetails = async (deviceId) => {

    
    navigate('/devicemanager/' + deviceId);
  };

  const closeModal = async () => {
    await fetchData(getAuthHeaders);
    setIsModalOpen(false); // Close the modal
};

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Devices Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                  onClick={() => setIsModalOpen(true)}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {/* Modal for adding a device */}
      <CreateDeviceDialog open={isModalOpen} handleClose={closeModal} />
      <Button variant="outlined" style={{ color: 'black', borderColor: 'black', height: '10px' }} onClick={() => setIsModalOpen(true)}>Create Device</Button>
      {renderDeleteDialog()}
    </DashboardLayout>
  );
};

export default DeviceManager;
