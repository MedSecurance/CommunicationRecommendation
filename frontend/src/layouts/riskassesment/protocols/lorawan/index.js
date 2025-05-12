import {
    Button, Select,
    MenuItem, FormControl, InputLabel, TextField, Box,
    Grid, Checkbox, FormControlLabel,
    Typography, Paper, FormHelperText, Snackbar, Alert, Tooltip
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import GateWayModal from './gateway-modal';
import { DeploymentCountryOptions } from './data-helper'
import NetworkFailures from '../components/network-failures-modal';

const LoraWAN = ({ getProtocolData, protocolData, errors }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [activeMeshsModalData, setActiveMeshsModalData] = useState({});
    const [lorawanAnswers, setLorawanAnswers] = useState({
        protocol: 'lorawan',
        communication_protocol_description: protocolData.communication_protocol_description ?? '',
        network_name: protocolData.network_name ?? '',
        already_implemented: protocolData.already_implemented ?? false,
        redundancy_measures: protocolData.redundancy_measures ?? false,
        intrusion_detection_system: protocolData.intrusion_detection_system ?? false,
        firmware_integrity_check: protocolData.firmware_integrity_check ?? false,
        security_audit_frequency_in_years: protocolData.security_audit_frequency_in_years ?? 0,
        riskAssessmentId: protocolData.riskAssessmentId ?? null,
        in_transit: protocolData.in_transit ?? false,
        at_rest: protocolData.at_rest ?? false,
        network_details: {
            network_failures: protocolData?.network_details?.network_failures ?? [],
            gateways: protocolData?.network_details?.gateways ?? [],
            deployment_country: protocolData?.network_details?.deployment_country ?? '',
            lifetime_in_years: protocolData?.network_details?.lifetime_in_years ?? '',
            multicast_enable: protocolData?.network_details?.multicast_enable ?? false,
            network_server: {
                name: protocolData?.network_details?.network_server?.name ?? '',
                deployment_type: protocolData?.network_details?.network_server?.deployment_type ?? '',
                firewall_enable: protocolData?.network_details?.network_server?.firewall_enable ?? false,
                log_monitoring_enable: protocolData?.network_details?.network_server?.log_monitoring_enable ?? false,
                bandwidth_in_Mbps: protocolData?.network_details?.network_server?.bandwidth_in_Mbps ?? '',
            },
            application_server: {
                name: protocolData?.network_details?.network_server?.name ?? '',
                deployment_type: protocolData?.network_details?.network_server?.deployment_type ?? '',
                firewall_enable: protocolData?.network_details?.network_server?.firewall_enable ?? false,
                log_monitoring_enable: protocolData?.network_details?.network_server?.log_monitoring_enable ?? false,
                bandwidth_in_Mbps: protocolData?.network_details?.network_server?.bandwidth_in_Mbps ?? '',
            },
        },
        other_connected_devices: protocolData.other_connected_devices ?? 0
    });

    const cause_of_failures = [{ value: "HardwareIssue", displayValue: "Hardware Issue" },
    { value: "Interference", displayValue: "Interference" },
    { value: "Overload", displayValue: "Overload" },
    { value: "SoftwareFirmware", displayValue: "Software Firmware" },
    { value: "Power", displayValue: "Power" },
    { value: "Environment", displayValue: "Environment" },
    { value: "ConfigurationError", displayValue: "Configuration Error" },
    { value: "NetworkCongestion", displayValue: "Network Congestion" }];

    useEffect(() => {

        if (errors.gateways && !lorawanAnswers.network_details.gateways.length) {
            setSnackbarMessage("Please add gateways");
            setSnackbarOpen(true);
            errors.gateways = undefined;

        }
        getProtocolData(lorawanAnswers);
    }, [lorawanAnswers, errors]);


    const showModal = () => {
        setActiveMeshsModalData({});
        setModalOpen(true);
    };

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [activeNetworkFailuresModalData, setActiveNetworkFailuresModalData] = useState({});

    const handleDeleteItem = (index) => {
        // Update the list to remove the item at the given index
        const updatedList = lorawanAnswers.network_details?.network_failures.filter((_, i) => i !== index);

        // Assuming you're using state to manage the list
        setLorawanAnswers(prevState => ({
            ...prevState,
            network_details: {
                ...prevState.network_details,
                network_failures: updatedList,
            },
        }));
    };


    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const closeModal = (modalModel) => {

        var m = modalModel;
        setModalOpen(false); // Close the modal
    };

    const updateHub = (updatedAccessPoints) => {
        setLorawanAnswers(prevState => ({
            ...prevState,
            network_details: {
                ...prevState.network_details,
                gateways: [
                    ...prevState.network_details.gateways,
                    updatedAccessPoints
                ]
            }
        }));
    };

    const updateAccessPointByUUID = (updatedAccessPoint) => {
        setLorawanAnswers(prevState => {
            const gateways = prevState.network_details.gateways;
            const index = gateways.findIndex(ap => ap.id === updatedAccessPoint.id);
            if (index !== -1) {
                const newAccessPoints = [...gateways];
                newAccessPoints[index] = { ...newAccessPoints[index], ...updatedAccessPoint };

                return {
                    ...prevState,
                    network_details: {
                        ...prevState.network_details,
                        gateways: newAccessPoints

                    }
                };
            }

            // If the UUID is not found, return the original state
            return prevState;
        });
    };

    const handleAddedItemClick = (itemData) => {

        setActiveMeshsModalData(itemData);
        setModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const propertyNames = name.split('.');
        let updatedState = { ...lorawanAnswers };
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

        setLorawanAnswers({ ...updatedState });

    };

    const handleCheckboxChange = (e) => {

        const { name, checked } = e.target;
        const propertyNames = name.split('.');
        let updatedState = { ...lorawanAnswers };
        let currentLevel = updatedState;
        for (let i = 0; i < propertyNames.length; i++) {
            const propertyName = propertyNames[i];
            if (i === propertyNames.length - 1) {
                currentLevel[propertyName] = checked;
            } else {
                currentLevel[propertyName] = currentLevel[propertyName] || {};
                currentLevel = currentLevel[propertyName];
            }
        }
        setLorawanAnswers({ ...updatedState });

    };

    const [networkFailursModalOpen, setNetworkFailursModalOpen] = useState(false);

    const CloseNerworkFailureModal = () => {
        setNetworkFailursModalOpen(false);
    };

    const updateNetworkFailures = (updatedNetworkFailures) => {

        setLorawanAnswers(prevState => ({
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

    const updateNetworkFailersByUUID = (updatedNetworkFail) => {
        setLorawanAnswers(prevState => {
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

    const showNetworkFailuresModal = () => {
        setActiveNetworkFailuresModalData({});
        setNetworkFailursModalOpen(true);
    };

    const handleAddedItemNetworkFailuresClick = (itemData) => {
        setActiveNetworkFailuresModalData(itemData);
        setNetworkFailursModalOpen(true);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Description'
                        value={lorawanAnswers.communication_protocol_description}
                        name='communication_protocol_description'
                        onChange={handleInputChange}
                        error={!!errors.communication_protocol_description}
                        helperText={errors.communication_protocol_description ?? ''}
                        id='1'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        name='network_name'
                        value={lorawanAnswers.network_name}
                        onChange={handleInputChange}
                        label='Network Name'
                        id='2'
                        error={!!errors.network_name}
                        helperText={errors.network_name ?? ''}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                inputProps={{ 'aria-label': 'Already Implemented' }}
                                name='already_implemented'
                                checked={lorawanAnswers.already_implemented}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'Already Implemented'}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                inputProps={{ 'aria-label': 'Redundancy Measures' }}
                                name='redundancy_measures'
                                checked={lorawanAnswers.redundancy_measures}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'Redundancy Measures'}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                inputProps={{ 'aria-label': 'Intrusion Detection System' }}
                                name='intrusion_detection_system'
                                checked={lorawanAnswers.intrusion_detection_system}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'Intrusion Detection System'}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                inputProps={{ 'aria-label': 'Firmware Integrity Check' }}
                                name='firmware_integrity_check'
                                checked={lorawanAnswers.firmware_integrity_check}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'Firmware Integrity Check'}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='number'
                        name='security_audit_frequency_in_years'
                        value={lorawanAnswers?.security_audit_frequency_in_years}
                        onChange={handleInputChange}
                        label='Security Audit Frequency In Years'
                        id='8'
                        error={!!errors.security_audit_frequency_in_years}
                        helperText={errors.security_audit_frequency_in_years ?? ''}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='number'
                        label='Other Connected Devices'
                        id='6'
                        value={lorawanAnswers?.other_connected_devices}
                        name='other_connected_devices'
                        onChange={handleInputChange}
                        error={!!errors.other_connected_devices}
                        helperText={errors.other_connected_devices ?? ''}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Click here to add network failures for this protocol.">
                    <Button
                        variant="outlined"
                        onClick={() => showNetworkFailuresModal()}
                        style={{ color: 'black', borderColor: 'black', width: '100%', height: '56px' }}>
                        {'Add NETWORK FAILURES'}
                    </Button>
                </Tooltip>

                {
                    lorawanAnswers.network_details?.network_failures?.map((itemData, index) => (
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
            <Grid item xs={12}>
                <Box component={Paper} elevation={2} p={2} style={{ textAlign: 'center', gridColumn: '1 / -1' }} >
                    <Typography variant="h6">{'Network details'}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Button
                    variant="outlined"
                    onClick={() => showModal()}
                    style={{ color: 'black', borderColor: 'black', width: '100%', height: '56px' }}>
                    {'Add Gateway'}
                </Button>
                {
                    lorawanAnswers.network_details?.gateways?.map((itemData, index) => (
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
                            {itemData.gateway_name}
                        </li>
                    ))}
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>{'Deployment Country'}</InputLabel>
                    <Select
                        label="Deployment Country"
                        name='network_details.deployment_country'
                        id='6'
                        value={lorawanAnswers?.network_details?.deployment_country}
                        onChange={handleInputChange}
                    >
                        {
                            DeploymentCountryOptions?.map((itemData) => (
                                <MenuItem key={itemData.value} value={itemData.value}>{itemData.label}</MenuItem>

                            ))}

                    </Select>
                    {errors.deployment_country && (
                        <FormHelperText sx={{ color: 'red' }}>{errors.deployment_country}</FormHelperText>
                    )}
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='number'
                        name='network_details.lifetime_in_years'
                        value={lorawanAnswers?.network_details?.lifetime_in_years}
                        onChange={handleInputChange}
                        label='Lifetime in Years'
                        id='8'
                        error={!!errors.lifetime_in_years}
                        helperText={errors.lifetime_in_years ?? ''}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                inputProps={{ 'aria-label': 'Multicast Enable' }}
                                name='network_details.multicast_enable'
                                checked={lorawanAnswers?.network_details?.multicast_enable}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'Multicast Enable'}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'left', gridColumn: 'auto' }}>
                <Typography variant="h6">{'Network Server'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        value={lorawanAnswers?.network_details?.network_server?.name}
                        name='network_details.network_server.name'
                        onChange={handleInputChange}
                        label='Name'
                        id='12'
                        error={!!errors.networkServerName}
                        helperText={errors.networkServerName ?? ''}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>{'Deployment Type'}</InputLabel>
                    <Select
                        label={'Deployment Type'}
                        name='network_details.network_server.deployment_type'
                        value={lorawanAnswers?.network_details?.network_server?.deployment_type}
                        onChange={(e) => handleInputChange(e)}
                        id='7324'
                    >
                        <MenuItem key={'cloud'} value={'cloud'}>{'Cloud'}</MenuItem>
                    </Select>
                    {errors.networkServerDeploymentType && (
                        <FormHelperText sx={{ color: 'red' }}>{errors.networkServerDeploymentType}</FormHelperText>
                    )}
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                inputProps={{ 'aria-label': 'Firewal Enable' }}
                                name='network_details.network_server.firewall_enable'
                                checked={lorawanAnswers?.network_details?.network_server?.firewall_enable}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'Firewal Enable'}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                inputProps={{ 'aria-label': 'Log Monitoring Enable' }}
                                name='network_details.network_server.log_monitoring_enable'
                                checked={lorawanAnswers?.network_details?.network_server?.log_monitoring_enable}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'Log Monitoring Enable'}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='number'
                        value={lorawanAnswers?.network_details?.network_server?.bandwidth_in_Mbps}
                        name='network_details.network_server.bandwidth_in_Mbps'
                        onChange={handleInputChange}
                        label='Bandwidth in Mbps'
                        id='12'
                        error={!!errors.bandwidth_in_Mbps}
                        helperText={errors.bandwidth_in_Mbps ?? ''}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'left', gridColumn: 'auto' }}>
                <Typography variant="h6">{'Aplication Server'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        value={lorawanAnswers?.network_details?.application_server?.name}
                        name='network_details.application_server.name'
                        onChange={handleInputChange}
                        label='Name'
                        id='12'
                        error={!!errors.applicationServerName}
                        helperText={errors.applicationServerName ?? ''}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>{'Deployment Type'}</InputLabel>
                    <Select
                        label={'Deployment Type'}
                        name='network_details.application_server.deployment_type'
                        value={lorawanAnswers?.network_details?.application_server?.deployment_type}
                        onChange={(e) => handleInputChange(e)}
                        id='7324'
                    >
                        <MenuItem key={'cloud'} value={'cloud'}>{'Cloud'}</MenuItem>
                    </Select>
                    {errors.applicationServerDeploymentType && (
                        <FormHelperText sx={{ color: 'red' }}>{errors.applicationServerDeploymentType}</FormHelperText>
                    )}
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                inputProps={{ 'aria-label': 'Firewal Enable' }}
                                name='network_details.application_server.firewall_enable'
                                checked={lorawanAnswers?.network_details?.application_server?.firewall_enable}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'Firewal Enable'}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                inputProps={{ 'aria-label': 'Log Monitoring Enable' }}
                                name='network_details.application_server.log_monitoring_enable'
                                checked={lorawanAnswers?.network_details?.application_server?.log_monitoring_enable}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'Log Monitoring Enable'}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='number'
                        value={lorawanAnswers?.network_details?.application_server?.bandwidth_in_Mbps}
                        name='network_details.application_server.bandwidth_in_Mbps'
                        onChange={handleInputChange}
                        label='Bandwidth in Mbps'
                        id='12'
                        error={!!errors.applicationServerBandwidth}
                        helperText={errors.applicationServerBandwidth ?? ''}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Box component={Paper} elevation={2} p={2} style={{ textAlign: 'center', gridColumn: '1 / -1' }} >
                    <Typography variant="h6">{'Data Privacy Measures'}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                inputProps={{ 'aria-label': 'At Rest' }}
                                name='at_rest'
                                checked={lorawanAnswers.at_rest}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'At Rest'}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                inputProps={{ 'aria-label': 'In Transitt' }}
                                name='in_transit'
                                checked={lorawanAnswers.in_transit}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'In Transitt'}
                    />
                </FormControl>
            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <NetworkFailures open={networkFailursModalOpen}
                handleClose={CloseNerworkFailureModal}
                updateNetworkFailures={updateNetworkFailures}
                networkFailureData={activeNetworkFailuresModalData} updateNetworkFailersByUUID={updateNetworkFailersByUUID} causeOffailures={cause_of_failures} />
            <GateWayModal open={modalOpen} handleClose={closeModal} updateHub={updateHub} hubData={activeMeshsModalData} updateAccessPointByUUID={updateAccessPointByUUID} />
        </Grid>
    )
};



export default LoraWAN;