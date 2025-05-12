import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Card, Typography, Button, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  Snackbar, Alert, LinearProgress
} from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { GetDevices, DeleteDevice, AddDevice } from "services/device-manager-service";
import Icon from "@mui/material/Icon";
import CreateDeviceDialog from "./components/create-device/index";
import { KeycloakContext } from '../../keycloak-provider';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { hasPermission } from '../../authentication-helpers/role-validator';

const DeviceManager = () => {
  const { getAuthHeaders, roles } = useContext(KeycloakContext);
  
  const canDelete = hasPermission(roles, 'DeviceManager', 'delete');
  const canViewDetails = hasPermission(roles, 'DeviceManager', 'view');
  const canInsert = hasPermission(roles, 'DeviceManager', 'insert');

  const columns = [
    { Header: "Device Name", accessor: "name", align: "left" },
    { Header: "Connected Network Name", accessor: "networkName", align: "left" },
    { Header: "Description", accessor: "description", align: "left" },
    { Header: "action", accessor: "action", align: "right" }
  ];

  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deviceIdToDelete, setDeviceIdToDelete] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarMessageSeverity, setSnackbarMessageSeverity] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData(getAuthHeaders);
  }, []);

  const fetchData = async (getAuthHeaders) => {
    try {
      const response = await GetDevices(getAuthHeaders);
      setRows(response.devices.map(device => ({
        name: (<Typography display="block" variant="caption" fontWeight="medium">{device.name}</Typography>),
        networkName: (<Typography display="block" variant="caption" fontWeight="medium">{device.networkName}</Typography>),
        description: (<Typography component="a" variant="caption" color="text" fontWeight="medium">{device.description}</Typography>),
        action: (
          <>
            {canViewDetails && (
              <MDTypography onClick={() => HandleShowDetails(device.id)} component="a" href="#" color="text">
                <Icon>info</Icon>
              </MDTypography>
            )}
            {canDelete && (
              <MDTypography onClick={() => openDeleteDialog(device.id)} component="a" href="#" color="text">
                <Icon>delete</Icon>
              </MDTypography>
            )}
          </>
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
      await fetchData(getAuthHeaders);
      closeDeleteDialog();
    }
  };

  const handleExport = async () => {
    const response = await GetDevices(getAuthHeaders);
    if (!response || !response.devices || response.devices.length === 0) {
      setSnackbarMessage("No devices found");
      setSnackbarMessageSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const jsonData = JSON.stringify(response);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'devices.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const fileInputRef = useRef(null);

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async () => {
        try {
          const parsedData = JSON.parse(reader.result);
          const devices = parsedData.devices;
          const totalDevices = devices.length;

          let successCount = 0;
          let failureCount = 0;

          setUploading(true);
          setUploadProgress(0);
          setUploadResult(null);

          for (let i = 0; i < totalDevices; i++) {
            const device = devices[i];
            try {
              await AddDevice(device, getAuthHeaders);
              successCount++;
            } catch (error) {
              failureCount++;
              console.error('Error adding device:', error);
            }
            setUploadProgress(Math.round(((i + 1) / totalDevices) * 100));
          }

          setUploadResult({ success: successCount, failed: failureCount });
          fetchData(getAuthHeaders);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          setUploadResult({ success: 0, failed: 0 });
        } finally {
          setUploading(false);
          event.target.value = '';
        }
      };
      reader.onerror = () => {
        console.error('Error reading file:', reader.error);
        event.target.value = '';
        setUploading(false);
      };
    }
  };

  const HandleShowDetails = (deviceId) => {
    navigate('/devicemanager/' + deviceId);
  };

  const closeModal = async () => {
    await fetchData(getAuthHeaders);
    setIsModalOpen(false);
  };

  const renderDeleteDialog = () => (
    <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this device? This action cannot be undone.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteDialog} color="primary">Cancel</Button>
        <Button onClick={confirmDelete} color="secondary" autoFocus>Delete</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">Device Table</MDTypography>
                  <MDBox display="flex" gap={2}>
                    <Button variant="contained" startIcon={<UploadFileIcon />} style={{ background: 'white' }} onClick={handleExport}>Export Devices</Button>
                    {canInsert && (<div>
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                            <Button variant="contained" startIcon={<UploadFileIcon />} style={{ background: 'white' }} onClick={handleUpload}>Import Devices</Button> </div> )}

                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable table={{ columns, rows }} isSorted={false} entriesPerPage={true} showTotalEntries={true} noEndBorder onClick={() => setIsModalOpen(true)} />
                {uploading && (
                  <MDBox mt={4} px={2}>
                    <Typography variant="body2" color="textSecondary">Uploading Devices... ({uploadProgress}%)</Typography>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  </MDBox>
                )}
                {uploadResult && (
                  <MDBox mt={2} px={2}>
                    <Typography variant="body2" color="success.main">Successfully imported: {uploadResult.success}</Typography>
                    <Typography variant="body2" color="error.main">Failed to import: {uploadResult.failed}</Typography>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={snackbarMessageSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert>
          </Snackbar>
        </Grid>
      </MDBox>
      <CreateDeviceDialog open={isModalOpen} handleClose={closeModal} />
      {canInsert && (
        <Button variant="outlined" style={{ color: 'black', borderColor: 'black', height: '10px' }} onClick={() => setIsModalOpen(true)}>Create Device</Button>
      )}
      {renderDeleteDialog()}
    </DashboardLayout>
  );
};

export default DeviceManager;
