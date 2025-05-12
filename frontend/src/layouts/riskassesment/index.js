import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Button, Select, MenuItem, FormControl, InputLabel, Box, Stepper, Step, StepLabel,
  Grid, Card, CircularProgress, Typography, IconButton, Snackbar, Alert, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { stepperJson } from "./data/risk-assesment-stepper-data";
import { deleteRiskAssessmentById, postWifiAnswersToApi, postBluetoothAnswersToApi, postLoraWanAnswersToApi, postGsmAnswersToApi, getRiskAssessments, getRiskAssessmentById } from "services/protocol-evaluator-service";

import Wifi from '../riskassesment/protocols/wifi/index.js';
import Bluetooth from '../riskassesment/protocols/bluetooth/index.js';
import LoraWAN from '../riskassesment/protocols/lorawan/index.js';
import Gsm from '../riskassesment/protocols/gsm/index.js';

import mapWifiDataToApiData from '../riskassesment/mappers/wifi-mapper.js';
import mapBluetoothMapperApiData from '../riskassesment/mappers/bluetooth-mapper.js';
import loraWanApiData from '../riskassesment/mappers/lora-wan-mapper.js';
import mapGsmApiData from '../riskassesment/mappers/gsm-mapper.js'

//Validations
import bluetoothValidations from '../riskassesment/protocols/bluetooth/bluetooth-validations.js';
import loraWanValidations from '../riskassesment/protocols/lorawan/lorawan-validations.js'
import gsmValidations from '../riskassesment/protocols/gsm/gsm-validations.js'
import wifiValidations from '../riskassesment/protocols/wifi/wifi-validations.js'
import { useApiRequest } from '../../auth/serviceInterceptor'; // Assuming you have an AuthContext for managing authentication
import { KeycloakContext } from '../../keycloak-provider';
import { hasPermission } from '../../authentication-helpers/role-validator';


//DataTable
import DataTable from "examples/Tables/DataTable";
import Icon from "@mui/material/Icon";

const RiskAssessment = () => {
  const { getAuthHeaders, roles } = useContext(KeycloakContext);
  const { apiRequest } = useApiRequest();

  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState({});
  const [protocolValue, setProtocolValue] = useState('');
  const [protocolData, setProtocolData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showRiskAssessment, setShowRiskAssesment] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [rows, setRows] = useState([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [riskAssessmentIdToDelete, setRiskAssessmentIdToDelete] = useState(null);

  const canDelete = hasPermission(roles, 'RiskAssessment', 'delete');
  const canViewDetails = hasPermission(roles, 'RiskAssessment', 'view');
  const canInsert = hasPermission(roles, 'RiskAssessment', 'insert');

  const sortByWeight = (array) => array.sort((a, b) => b.weight - a.weight);
  const sortBySeverity = (array) => array.sort((a, b) => b.severity - a.severity);

  const [silentExecute, setSilentExecute] = useState(false);

  const weightColors = {
    5: '#ff0000',
    4: '#bf3284',
    3: '#e97132',
    2: '#b6c276',
    1: '#32c22b',
  };

  const getWeight = (item) => {
    if (item.weight !== undefined) return item.weight;
    if (item.severity !== undefined) {
      if (item.severity >= 9) return 5;
      if (item.severity === 8) return 4;
      if (item.severity === 7) return 3;
      if (item.severity === 6) return 2;
      if (item.severity === 5) return 1;
    }
    return undefined; // fallback
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const initialQuestions = [
    {
      id: "protocol",
      question: "Choose Protocol",
      type: "dropdown",
      options: stepperJson.protocols.map(protocol => ({
        value: protocol.Protocol,
        label: protocol.Protocol
      })),
      required: true,
    }
  ];
  const [steps, setSteps] = useState([{ label: "Select Protocol", questions: initialQuestions }, { label: "Results", questions: [] }]);

  useEffect(() => {
    setSteps([{ label: "Select Protocol", questions: initialQuestions }, { label: "Results", questions: [] }]);
  }, [answers['protocol']]);

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (silentExecute) {
      handleNext();
    }
  }, [silentExecute]);

  const fetchData = async () => {
    try {
      const response = await getRiskAssessments(apiRequest);
      // Update rows state with fetched data
      setRows(response.riskAssessments.map(riskAssessment => ({
        networkName: (
          <Typography display="block" variant="caption" fontWeight="medium">
            {riskAssessment.networkName}
          </Typography>
        ),
        protocol: (
          <Typography display="block" variant="caption" fontWeight="medium">
            {riskAssessment.protocol}
          </Typography>
        ),
        createdAt: (
          <Typography component="a" variant="caption" color="text" fontWeight="medium">
            {riskAssessment.createdAt}
          </Typography>
        ),
        updatedAt: (
          <Typography component="a" variant="caption" color="text" fontWeight="medium">
            {riskAssessment.updatedAt}
          </Typography>
        ),
        action: (
          <>
            {canViewDetails && (
              <MDTypography onClick={() => HandleShowDetails(riskAssessment.id, canInsert)} component="a" href="#" color="text">
                <Icon>info</Icon>
              </MDTypography>
            )}
            {canDelete && (
              <MDTypography onClick={() => openDeleteDialog(riskAssessment.id)} component="a" href="#" color="text">
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

  // Render the delete confirmation dialog
  const renderDeleteDialog = () => (
    <Dialog
      open={deleteDialogOpen}
      onClose={closeDeleteDialog}
    >
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this risk assessment? This action cannot be undone.
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

  const handleNext = async () => {
    if (!protocolValue) {
      setSnackbarMessage("Please select a protocol")
      setSnackbarOpen(true);
      return;
    }
    setErrors({});
    if (activeStep === steps.length - 2) {

      setLoading(true);
      if (protocolData.protocol === 'wifi') {
        const newErrors = wifiValidations(protocolData);
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }

        const mappedData = mapWifiDataToApiData(protocolData);
        const response = await postWifiAnswersToApi(mappedData, getAuthHeaders);
        setResult(response);
        await fetchData();
      } else if (protocolData.protocol === 'bluetooth') {

        const newErrors = bluetoothValidations(protocolData);
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
        const mappedData = mapBluetoothMapperApiData(protocolData);
        const response = await postBluetoothAnswersToApi(mappedData, getAuthHeaders);
        setResult(response);
      } else if (protocolData.protocol === 'lorawan') {

        const newErrors = loraWanValidations(protocolData);
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
        const mappedData = loraWanApiData(protocolData);
        const response = await postLoraWanAnswersToApi(mappedData, getAuthHeaders);
        setResult(response);
      }
      else if (protocolData.protocol === 'Gsm') {
        const newErrors = gsmValidations(protocolData);
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
        const mappedData = mapGsmApiData(protocolData);
        const response = await postGsmAnswersToApi(mappedData, getAuthHeaders);
        setResult(response);
      }

      setLoading(false);
      setActiveStep((prev) => prev + 1);

    } else {
      setActiveStep((prev) => prev + 1);
    }

    setSilentExecute(false);
  };

  const openDeleteDialog = (riskAssessmentId) => {
    setRiskAssessmentIdToDelete(riskAssessmentId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRiskAssessmentIdToDelete(null);
  };

  const confirmDelete = async () => {
    if (riskAssessmentIdToDelete) {
      await deleteRiskAssessmentById(riskAssessmentIdToDelete, apiRequest);
      await fetchData(); // Refresh data after deletion
      closeDeleteDialog(); // Close the dialog after deletion
    }
  };

  const getProtocolData = (protocolData) => {
    setProtocolData(protocolData);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const HandleDownloadResultsAndAnswers = () => {

    if (result) {
      protocolData.results = result
    }

    const jsonData = JSON.stringify(protocolData)
    const blob = new Blob([jsonData], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'riskAssessmetResults.json';
    document.body.appendChild(link);
    link.click();


    link.parentNode.removeChild(link);

  };

  // Use a ref to reference the hidden file input element
  const fileInputRef = useRef(null);

  // Function to handle the button click and trigger file input click
  const handleUpload = () => {
    fileInputRef.current.click();
  };

  // Function to handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Read the file as text
      reader.readAsText(file);
      // On load, parse the JSON and save to state
      reader.onload = () => {
        try {
          const parsedData = JSON.parse(reader.result);
          setProtocolData(parsedData);
          setProtocolValue(parsedData.protocol.toLowerCase());
          setShowRiskAssesment(true);
          console.log('Parsed JSON data:', parsedData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };

      // Handle errors reading the file
      reader.onerror = () => {
        console.error('Error reading file:', reader.error);
      };
    }
  };

  const renderProtocolChoice = () => {
    switch (protocolValue) {
      case 'wifi':
        return (<Wifi getProtocolData={getProtocolData} protocolData={protocolData} errors={errors} />)
      case 'bluetooth':
        return (<Bluetooth getProtocolData={getProtocolData} protocolData={protocolData} errors={errors} />)
      case 'gsm':
        return (<Gsm getProtocolData={getProtocolData} protocolData={protocolData} errors={errors} />)
      case 'lorawan':
        return (<LoraWAN getProtocolData={getProtocolData} protocolData={protocolData} errors={errors} />)
      default:
        return ('');
    }
  };

  const handleProtocolInputChange = (e) => {
    setErrors({});
    setProtocolData({});
    const { name, value } = e.target;
    setProtocolValue(value);
  };

  const handleClose = () => {
    setProtocolData({});
    setActiveStep(0);
    setErrors({});
    setResult({});
    setProtocolValue('');
    setShowRiskAssesment(false);
  };

  const renderStepper = () => {
    return (<MDBox mt={6} mb={3}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} lg={8}>
          <Card>
            <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h5">Risk Assessment</MDTypography>
              {/* Close button */}
              <IconButton onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
            </MDBox>
            <Box sx={{ width: '100%' }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <MDBox p={2}>
                {activeStep === steps.length ? (
                  <MDTypography>All steps completed - you're finished</MDTypography>
                ) : (
                  <>
                    {activeStep === steps.length - 1 ? (
                      loading ? (
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="h4" align="center" sx={{ mb: 2 }}>
                            Results
                          </Typography>

                          {[{ title: "Mitigations", data: sortByWeight(result.mitigations) },
                          { title: "Safe Configurations", data: sortByWeight(result.safeConfigs) },
                          { title: "Protocol Replacements", data: result.replacements.suggestions ? sortByWeight(result.replacements.suggestions) : [] },
                          { title: "Vulnerabilities", data: result.vulnerabilities ? sortBySeverity(result.vulnerabilities) : [] }
                          ].map((section, index) => (
                            <Accordion key={index} defaultExpanded>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h5">{section.title}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {section.data.length > 0 ? (
                                  section.data.map((item, idx) => (
                                    <MDTypography
                                      variant="h6"
                                      key={idx}
                                      style={{ color: weightColors[getWeight(item)] || '#000', marginBottom: '8px' }}
                                    >
                                      <strong> ({item.weight || item.severity}) </strong>
                                      {item.host ? " Host :" + item.host + " - " : " "}
                                      {item.message || item.text}
                                    </MDTypography>

                                  ))
                                ) : (
                                  <Typography variant="body2" color="textSecondary">
                                    No {section.title.toLowerCase()} available.
                                  </Typography>
                                )}
                              </AccordionDetails>
                            </Accordion>
                          ))}

                          {canInsert && (
                            <Box sx={{ display: "flex", flexDirection: "row", pt: 2, justifyContent: "space-between" }}>
                              <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                                Back
                              </Button>
                              <Box sx={{ flex: "1 1 auto" }} />
                              <Button color="inherit" onClick={HandleDownloadResultsAndAnswers} sx={{ mr: 1 }}>
                                Download Answers
                              </Button>
                            </Box>
                          )}


                        </Box>
                      )
                    ) : (
                      <>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                              <InputLabel>{'Protocol'}</InputLabel>
                              <Select
                                label={'Protocol'}
                                id='15'
                                value={protocolValue}
                                onChange={(e) => handleProtocolInputChange(e)}
                              >
                                <MenuItem key={'wifi'} value={'wifi'}>{'WiFi'}</MenuItem>
                                <MenuItem key={'bluetooth'} value={'bluetooth'}>{'Bluetooth'}</MenuItem>
                                <MenuItem key={'gsm'} value={'gsm'}>{'Gsm'}</MenuItem>
                                <MenuItem key={'lorawan'} value={'lorawan'}>{'LoRaWAN'}</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                        {renderProtocolChoice()}
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                          <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                          >
                            Back
                          </Button>
                          <Box sx={{ flex: '1 1 auto' }} />
                          <Button onClick={handleNext}>
                            {activeStep === steps.length - 2 ? 'Finish' : 'Next'}
                          </Button>
                        </Box>
                      </>
                    )}
                  </>
                )}
              </MDBox>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </MDBox>)
  }

  const openRiskAssessment = () => {
    setShowRiskAssesment(true);
  }

  const HandleShowDetails = async (riskAssessmentId, canInsert) => {

    const data = await getRiskAssessmentById(riskAssessmentId, getAuthHeaders);
    const protocolDataResponse = JSON.parse(data.riskAssessment.body)
    protocolDataResponse.riskAssessmentId = data.riskAssessment.id;
    setShowRiskAssesment(true);
    setProtocolValue(data.riskAssessment.protocol.toLowerCase())
    setProtocolData(protocolDataResponse);

    if (!canInsert) {
      setSilentExecute(true);
    }

  };

  const columns = [
    { Header: "Protocol", accessor: "protocol", align: "left" },
    { Header: "Network Name", accessor: "networkName", align: "left" },
    { Header: "Created", accessor: "createdAt", align: "left" },
    { Header: "Updated", accessor: "updatedAt", align: "right" },
    { Header: "action", accessor: "action", align: "right" }

  ]

  const renderTable = () => {
    return (<MDBox pt={6} pb={3}>
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
              <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6" color="white">
                  Risk Assessment History
                </MDTypography>              {/* Close button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                {/* Button that looks like a button */}
                <Button
                  variant="contained"
                  startIcon={<UploadFileIcon />}
                  style={{ background: 'white' }}
                  onClick={handleUpload}
                >
                  Upload File
                </Button>
              </MDBox>

            </MDBox>
            <MDBox pt={3}>
              <DataTable
                table={{ columns, rows }}
                isSorted={true}
                entriesPerPage={true}
                showTotalEntries={true}
                noEndBorder
              />
              {canInsert && (
                <Grid item xs={12} sm={6}>
                  <Button onClick={() => openRiskAssessment()} variant="outlined" style={{ color: 'black', borderColor: 'black', height: '10px' }} >New Risk Assessment</Button>
                </Grid>
              )}
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
    )
  }

  const colors = ['red', 'purple'];

  return (

    <DashboardLayout>
      <DashboardNavbar />
      {showRiskAssessment ? renderStepper() : renderTable()}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {renderDeleteDialog()}
    </DashboardLayout>
  );
};

export default RiskAssessment;
