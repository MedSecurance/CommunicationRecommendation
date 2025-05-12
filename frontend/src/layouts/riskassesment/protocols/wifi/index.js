import {
    Button, Select,
    MenuItem, FormControl, InputLabel, TextField, Box,
    Grid, Checkbox, FormControlLabel,
    Typography, Paper, FormHelperText, Snackbar, Alert, Tooltip, LinearProgress
} from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import AcessPointModal from './acess-point';
import NetworkFailures from '../components/network-failures-modal';
import MDBox from "components/MDBox";

const Wifi = ({ getProtocolData, protocolData, errors }) => {

    const cause_of_failures = [{ value: "HardwareIssue", displayValue: "Hardware Issue" },
    { value: "Interference", displayValue: "Interference" },
    { value: "Overload", displayValue: "Overload" },
    { value: "SoftwareFirmware", displayValue: "Software Firmware" },
    { value: "Power", displayValue: "Power" },
    { value: "Environment", displayValue: "Environment" },
    { value: "ConfigurationError", displayValue: "Configuration Error" }];

    const [modalOpen, setModalOpen] = useState(false);
    const [networkFailursModalOpen, setNetworkFailursModalOpen] = useState(false);

    const [activeAccessModalData, setActiveAccessModalData] = useState({});
    const [activeNetworkFailuresModalData, setActiveNetworkFailuresModalData] = useState({});

    const [wifiAnswers, setWifiAnswers] = useState({
        protocol: 'wifi',
        communication_protocol_description: protocolData.communication_protocol_description ?? '',
        use_case: protocolData.use_case ?? '',
        network_name: protocolData.network_name ?? '',
        firewall_enabled: protocolData.firewall_enabled ?? false,
        log_monitoring_enabled: protocolData.log_monitoring_enabled ?? false,
        redundancy_measures: protocolData.redundancy_measures ?? false,
        intrusion_detection_system: protocolData.intrusion_detection_system ?? false,
        firmware_integrity_check: protocolData.firmware_integrity_check ?? false,
        IP_range: protocolData.IP_range ?? '',
        already_implemented: protocolData.already_implemented ?? false,
        backbone_network_speed_in_Mpbs: protocolData.backbone_network_speed_in_Mpbs,
        ISP_connection_speed_in_Mpbs: protocolData.ISP_connection_speed_in_Mpbs,
        riskAssessmentId: protocolData.riskAssessmentId ?? null,
        network_details: {
            deployment_details: {
                access_points: protocolData?.network_details?.deployment_details?.access_points ?? [],
                placement: protocolData?.network_details?.deployment_details?.placement ?? '',
                lifetime_in_years: protocolData?.network_details?.deployment_details?.lifetime_in_years ?? '',
                wifi_topology_type: protocolData?.network_details?.deployment_details?.wifi_topology_type ?? 'SingleAP'
            },
            network_failures: protocolData?.network_details?.network_failures ?? [],
            other_connected_devices: protocolData?.network_details?.other_connected_devices ?? "0"
        },
        tvra_input: protocolData.tvra_input ?? []
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        if (errors.access_points && !wifiAnswers.network_details.deployment_details.access_points.length) {
            setSnackbarMessage("Please add gateways");
            setSnackbarOpen(true);
            errors.access_points = undefined;
        }
        getProtocolData(wifiAnswers);
    }, [wifiAnswers, errors]);

    const showModal = () => {
        setActiveAccessModalData({});
        setModalOpen(true);
    };

    const showNetworkFailuresModal = () => {
        setActiveNetworkFailuresModalData({});
        setNetworkFailursModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const CloseNerworkFailureModal = () => {
        setNetworkFailursModalOpen(false);
    };

    const updateAcessPoints = (updatedAccessPoints) => {

        setWifiAnswers(prevState => ({
            ...prevState,
            network_details: {
                ...prevState.network_details,
                deployment_details: {
                    ...prevState.network_details.deployment_details,
                    access_points: [
                        ...prevState.network_details.deployment_details.access_points,
                        updatedAccessPoints
                    ]
                }
            }
        }));
    };

    const updateNetworkFailures = (updatedNetworkFailures) => {

        setWifiAnswers(prevState => ({
            ...prevState,
            network_details: {
                ...prevState.network_details,
                network_failures: [
                    ...prevState.network_details.network_failures,
                    updatedNetworkFailures
                ]
            }
        }));
    };

    const handleAddedItemClick = (itemData) => {
        setActiveAccessModalData(itemData);
        setModalOpen(true);
    };

    const handleAddedItemNetworkFailuresClick = (itemData) => {
        setActiveNetworkFailuresModalData(itemData);
        setNetworkFailursModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const propertyNames = name.split('.');
        let updatedState = { ...wifiAnswers };
        let currentLevel = updatedState;
        for (let i = 0; i < propertyNames.length; i++) {
            const propertyName = propertyNames[i];
            if (i === propertyNames.length - 1) {
                currentLevel[propertyName] = value;
            } else {
                currentLevel[propertyName] = currentLevel[propertyName] || {};
                currentLevel = currentLevel[propertyName];
            }
        }
        setWifiAnswers({ ...updatedState });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setWifiAnswers(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

    const updateAccessPointByUUID = (updatedAccessPoint) => {
        setWifiAnswers(prevState => {
            const accessPoints = prevState.network_details.deployment_details.access_points;
            const index = accessPoints.findIndex(ap => ap.id === updatedAccessPoint.id);
            if (index !== -1) {
                const newAccessPoints = [...accessPoints];
                newAccessPoints[index] = { ...newAccessPoints[index], ...updatedAccessPoint };

                return {
                    ...prevState,
                    network_details: {
                        ...prevState.network_details,
                        deployment_details: {
                            ...prevState.network_details.deployment_details,
                            access_points: newAccessPoints
                        }
                    }
                };
            }

            // If the UUID is not found, return the original state
            return prevState;
        });
    };

    const updateNetworkFailersByUUID = (updatedNetworkFail) => {
        setWifiAnswers(prevState => {
            const networkFailures = prevState.network_details.network_failures;
            const index = networkFailures.findIndex(ap => ap.id === updatedNetworkFail.id);
            if (index !== -1) {
                const newNetworkFailes = [...networkFailures];
                newNetworkFailes[index] = { ...newNetworkFailes[index], ...updatedNetworkFail };

                return {
                    ...prevState,
                    network_details: {
                        ...prevState.network_details,
                        network_failures: newNetworkFailes
                    }
                };
            }

            // If the UUID is not found, return the original state
            return prevState;
        });
    };

    const handleDeleteItem = (index) => {
        // Update the list to remove the item at the given index
        const updatedList = wifiAnswers.network_details?.network_failures.filter((_, i) => i !== index);

        // Assuming you're using state to manage the list
        setWifiAnswers(prevState => ({
            ...prevState,
            network_details: {
                ...prevState.network_details,
                network_failures: updatedList,
            },
        }));
    };

    // Handle Upload TVRA

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadResult, setUploadResult] = useState(null);

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
                    var parsedData;
                    try {
                        parsedData = JSON.parse(reader.result);
                    } catch
                    {
                        throw new Error('Not a valid json file');
                    }

                    var report = parsedData.report;

                    if (!report || !Array.isArray(report)) {

                        throw new Error('Uploaded file must contain an array.');
                    }

                    const totalItems = report.length;

                    let successCount = 0;
                    let failureCount = 0;

                    setUploading(true);
                    setUploadProgress(0);
                    setUploadResult(null);

                    wifiAnswers.tvra_input = [];

                    for (let i = 0; i < totalItems; i++) {

                        const tvraItem = report[i];

                        try {

                            const isValidFormat = 
                                typeof tvraItem.host === 'string' &&
                                typeof tvraItem.port === 'string' &&
                                typeof tvraItem.severity === 'number' &&
                                typeof tvraItem.qod === 'number' &&
                                typeof tvraItem.text === 'string' ;
                            
                            if(!isValidFormat) {

                                failureCount++;
                                continue;
                            }
                            
                            wifiAnswers.tvra_input.push(tvraItem);
                            successCount++;

                        } catch (error) {
                            failureCount++;
                        }

                        setUploadProgress(Math.round(((i + 1) / totalItems) * 100));
                    }

                    setUploadResult({ success: successCount, failed: failureCount });
                } catch (error) {
                    setSnackbarMessage(error.message);
                    setSnackbarOpen(true);
                    setUploadResult({ success: 0, failed: 0 });
                } finally {
                    setUploading(false);
                    event.target.value = '';
                }
            };
            reader.onerror = () => {
                setSnackbarMessage("Error reading the file");
                setSnackbarOpen(true);

                event.target.value = '';
                setUploading(false);
            };
        }
    };


    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Provide a brief description of the communication protocol.">
                    <FormControl fullWidth>
                        <TextField
                            type='text'
                            label='Description'
                            id='1'
                            name='communication_protocol_description'
                            value={wifiAnswers.communication_protocol_description}
                            error={!!errors.communication_protocol_description}
                            helperText={errors.communication_protocol_description ?? ''}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Specify the primary use case for this protocol.">
                    <FormControl fullWidth>
                        <TextField
                            type='text'
                            label='UseCase'
                            id='1233'
                            name='use_case'
                            error={!!errors.use_case}
                            helperText={errors.use_case ?? ''}
                            value={wifiAnswers.use_case}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enter the name of the network.This should match the device network name">
                    <FormControl fullWidth>
                        <TextField
                            type='text'
                            label='Network Name'
                            id='2'
                            value={wifiAnswers.network_name}
                            error={!!errors.network_name}
                            helperText={errors.network_name ?? ''}
                            name='network_name'
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enable this if a firewall is active on the network.">
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    inputProps={{ 'aria-label': 'Firewall Enabled' }}
                                    name='firewall_enabled'
                                    checked={wifiAnswers.firewall_enabled}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label={'Firewall Enabled'}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enable this if log monitoring is active on the network.">
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    inputProps={{ 'aria-label': 'Log Monitor Enabled' }}
                                    name='log_monitoring_enabled'
                                    checked={wifiAnswers.log_monitoring_enabled}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label={'Log Monitor Enabled'}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enable this checkbox to indicate if redundancy measures are in place.">
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    inputProps={{ 'aria-label': 'Redundancy Measures' }}
                                    name='redundancy_measures'
                                    checked={wifiAnswers.redundancy_measures}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label={'Redundancy Measures'}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enable this checkbox to indicate the presence of an intrusion detection system.">
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    inputProps={{ 'aria-label': 'Intrusion Detection System' }}
                                    name='intrusion_detection_system'
                                    checked={wifiAnswers.intrusion_detection_system}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label={'Intrusion Detection System'}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enable this checkbox to indicate if firmware integrity checks are performed.">
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    inputProps={{ 'aria-label': 'Firmware Integrity Check' }}
                                    name='firmware_integrity_check'
                                    checked={wifiAnswers.firmware_integrity_check}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label={'Firmware Integrity Check'}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="The Ip Range address. This should be a valid Ip address. (e.g., 192.168.0.1/24)">
                    <FormControl fullWidth>
                        <TextField
                            type='text'
                            label='Ip Range'
                            id='5'
                            name='IP_range'
                            value={wifiAnswers.IP_range}
                            onChange={handleInputChange}
                            error={!!errors.IP_range}
                            helperText={errors.IP_range ?? ''}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="This boolean checkbox indicates if the protocol is already implemented">
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    inputProps={{ 'aria-label': 'Already Implemented' }}
                                    name='already_implemented'
                                    checked={wifiAnswers.already_implemented}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label={'Already Implemented'}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="The backbone network speed in Mpbs. This is a non negative integer">
                    <FormControl fullWidth>
                        <TextField
                            type="number"
                            label='Backbone Network Speed In Mpbs'
                            id='532'
                            value={wifiAnswers?.backbone_network_speed_in_Mpbs}
                            name='backbone_network_speed_in_Mpbs'
                            onChange={handleInputChange}
                            error={!!errors.backbone_network_speed_in_Mpbs}
                            helperText={errors.backbone_network_speed_in_Mpbs ?? ''}

                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="The ISP (internet service provider) connection speed In Mpbs. This is a non negative integer">
                    <FormControl fullWidth>
                        <TextField
                            type='number'
                            label='ISP Connection Speed In Mpbs'
                            id='533'
                            value={wifiAnswers?.ISP_connection_speed_in_Mpbs}
                            name='ISP_connection_speed_in_Mpbs'
                            onChange={handleInputChange}
                            error={!!errors.ISP_connection_speed_in_Mpbs}
                            helperText={errors.ISP_connection_speed_in_Mpbs ?? ''}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Box component={Paper} elevation={2} p={2} style={{ textAlign: 'center', gridColumn: '1 / -1' }} >
                    <Typography variant="h6">{'Network Details'}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Button
                    variant="outlined"
                    onClick={() => showModal()}
                    style={{ color: 'black', borderColor: 'black', width: '100%', height: '56px' }}>
                    {'Add ACCESS POINTS'}
                </Button>
                {
                    wifiAnswers.network_details?.deployment_details?.access_points?.map((itemData, index) => (
                        <li
                            key={index}
                            onClick={() => handleAddedItemClick(itemData)}
                            style={{
                                cursor: 'pointer',
                                fontSize: 'smaller',
                                color: 'blue',
                                textDecoration: 'underline',
                            }}
                        >
                            {itemData.access_point_name}
                        </li>
                    ))}
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Other Connected Devices.">
                    <FormControl fullWidth>
                        <TextField
                            type='number'
                            label='Other Connected Devices'
                            id='6'
                            value={wifiAnswers?.network_details?.other_connected_devices}
                            name='network_details.other_connected_devices'
                            onChange={handleInputChange}
                            error={!!errors.other_connected_devices}
                            helperText={errors.other_connected_devices ?? ''}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Specify the topology type.">
                    <FormControl fullWidth>
                        <InputLabel>{'Topology Type'}</InputLabel>
                        <Select
                            label={'Topology Type'}
                            id='7'
                            value={wifiAnswers?.network_details?.deployment_details?.wifi_topology_type}
                            name='network_details.deployment_details.wifi_topology_type'
                            onChange={(e) => handleInputChange(e)}
                            error={!!errors['network_details.deployment_details.wifi_topology_type']}
                        >
                            <MenuItem key={'SingleAP'} value={'SingleAP'}>{'SingleAP'}</MenuItem>
                            <MenuItem key={'Star'} value={'Star'}>{'Star'}</MenuItem>
                            <MenuItem key={'Mesh'} value={'Mesh'}>{'Mesh'}</MenuItem>
                        </Select>
                        {errors.wifi_topology_type && (
                            <FormHelperText sx={{ color: 'red' }}>{errors.wifi_topology_type}</FormHelperText>
                        )}
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enter the estimated operational lifespan of the network in years.">
                    <FormControl fullWidth>
                        <TextField
                            type='number'
                            label='Lifetime in Years'
                            id='8'
                            value={wifiAnswers?.network_details?.deployment_details?.lifetime_in_years}
                            name='network_details.deployment_details.lifetime_in_years'
                            onChange={handleInputChange}
                            error={!!errors.lifetime_in_years}
                            helperText={errors.lifetime_in_years ?? ''}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Select the physical or logical placement of network components (Local, Cloud, or Hybrid).">
                    <FormControl fullWidth>
                        <InputLabel>{'Placement'}</InputLabel>
                        <Select
                            label={'Placement'}
                            id='10'
                            value={wifiAnswers?.network_details?.deployment_details?.placement}
                            name='network_details.deployment_details.placement'
                            onChange={(e) => handleInputChange(e)}
                        >
                            <MenuItem key={'Local'} value={'Local'}>{'Local'}</MenuItem>
                            <MenuItem key={'Cloud'} value={'Cloud'}>{'Cloud'}</MenuItem>
                            <MenuItem key={'Hybrid'} value={'Hybrid'}>{'Hybrid'}</MenuItem>
                        </Select>
                        {errors.placement && (
                            <FormHelperText sx={{ color: 'red' }}>{errors.placement}</FormHelperText>
                        )}                </FormControl>
                </Tooltip>

            </Grid>
            <Grid item xs={12} sm={6}>
                <Button
                    variant="outlined"
                    onClick={() => showNetworkFailuresModal()}
                    style={{ color: 'black', borderColor: 'black', width: '100%', height: '56px' }}>
                    {'Add NETWORK FAILURES'}
                </Button>
                {
                    wifiAnswers.network_details?.network_failures?.map((itemData, index) => (
                        <li
                            key={index}
                            style={{
                                cursor: 'pointer',
                                fontSize: 'smaller',
                                color: 'blue',
                                textDecoration: 'underline'
                            }}
                        >
                            <span
                                onClick={() => handleAddedItemNetworkFailuresClick(itemData)}
                                style={{ flex: 1, marginRight: '10px' }} // Add some margin between text and button
                            >
                                {itemData.cause_of_failure}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering the span's onClick
                                    handleDeleteItem(index);
                                }}
                                style={{
                                    background: 'transparent',
                                    color: 'red',
                                    border: 'none',
                                    fontSize: 'small',
                                    cursor: 'pointer',
                                    padding: '0',
                                    margin: '0',             // Ensure no extra margin is applied
                                }}
                            >
                                X
                            </button>
                        </li>
                    ))
                }
            </Grid>
            <Grid item xs={12} sm={6}>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                <Button
                    variant="outlined"
                    onClick={() => handleUpload()}
                    style={{ color: 'black', borderColor: 'black', width: '100%', height: '56px' }}>
                    {'UPLOAD TVRA INPUT'}
                </Button>
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
            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <AcessPointModal open={modalOpen} handleClose={closeModal} updateAcessPoints={updateAcessPoints} acessPointsData={activeAccessModalData} updateAccessPointByUUID={updateAccessPointByUUID} />
            <NetworkFailures open={networkFailursModalOpen}
                handleClose={CloseNerworkFailureModal}
                updateNetworkFailures={updateNetworkFailures}
                networkFailureData={activeNetworkFailuresModalData} updateNetworkFailersByUUID={updateNetworkFailersByUUID} causeOffailures={cause_of_failures} />
        </Grid>
    )
};

export default Wifi;

