import {
    Button, FormControl, TextField, Box,
    Grid, Checkbox, FormControlLabel,
    Typography, Paper, Snackbar, Alert
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import HubModal from './gsm-node-modal';
import NetworkFailures from '../components/network-failures-modal';


const Gsm = ({ getProtocolData, protocolData, errors }) => {

    const cause_of_failures = [{ value: "HardwareIssue", displayValue: "Hardware Issue" },
    { value: "Interference", displayValue: "Interference" },
    { value: "NetworkCongestion", displayValue: "Network Congestion" },
    { value: "SoftwareFirmware", displayValue: "Software Firmware" },
    { value: "Power", displayValue: "Power" },
    { value: "Environment", displayValue: "Environment" },
    { value: "ConfigurationError", displayValue: "Configuration Error" }];

    const [networkFailursModalOpen, setNetworkFailursModalOpen] = useState(false);
    const [activeNetworkFailuresModalData, setActiveNetworkFailuresModalData] = useState({});

    const [modalOpen, setModalOpen] = useState(false);
    const [activeMeshsModalData, setActiveMeshsModalData] = useState({});
    const [gsmAnswers, setGsmAnswers] = useState({
        protocol: 'Gsm',
        communication_protocol_description: protocolData.communication_protocol_description ?? '',
        network_name: protocolData.network_name ?? '',
        already_implemented: protocolData.already_implemented ?? false,
        firmware_integrity_check: protocolData.firmware_integrity_check ?? false,
        log_monitoring_enabled: protocolData.log_monitoring_enabled ?? false,
        redundancy_measures: protocolData.redundancy_measures ?? false,
        intrusion_detection_system: protocolData.intrusion_detection_system ?? false,
        securityAuditFrequencyInYears: protocolData.securityAuditFrequencyInYears ?? 0,
        network_failures: protocolData?.network_failures ?? [],
        riskAssessmentId: protocolData.riskAssessmentId ?? null,
        lifetime_in_years: protocolData.lifetime_in_years ?? 0,
        at_rest: protocolData.at_rest ?? false,
        in_transit: protocolData.in_transit ?? false,
        gsmNodes: protocolData.gsmNodes ?? []
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    const handleAddedItemNetworkFailuresClick = (itemData) => {
        setActiveNetworkFailuresModalData(itemData);
        setNetworkFailursModalOpen(true);
    };

    const showNetworkFailuresModal = () => {
        setActiveNetworkFailuresModalData({});
        setNetworkFailursModalOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {

        if (errors.gsmNodes && !gsmAnswers.gsmNodes.length) {
            setSnackbarMessage("Please add gsm nodes");
            setSnackbarOpen(true);
        }

        getProtocolData(gsmAnswers);
    }, [gsmAnswers, errors]);

    const showModal = () => {
        setActiveMeshsModalData({});
        setModalOpen(true);
    };

    const closeModal = (modalModel) => {

        var m = modalModel;
        setModalOpen(false); // Close the modal
    };

    const updateHub = (updatedAccessPoints) => {
        setGsmAnswers(prevState => ({
            ...prevState,
            gsmNodes: [...prevState.gsmNodes, updatedAccessPoints]
        }));
    };

    const updateAccessPointByUUID = (updatedAccessPoint) => {
        setGsmAnswers(prevState => {
            const accessPoints = prevState.gsmNodes;
            const index = accessPoints.findIndex(ap => ap.id === updatedAccessPoint.id);
            if (index !== -1) {
                const newAccessPoints = [...accessPoints];
                newAccessPoints[index] = { ...newAccessPoints[index], ...updatedAccessPoint };

                return {
                    ...prevState,
                    gsmNodes: newAccessPoints
                };
            }
            return prevState;
        });
    };

    const updateNetworkFailersByUUID = (updatedNetworkFail) => {
        setGsmAnswers(prevState => {
            const networkFailures = prevState.network_failures;
            const index = networkFailures.findIndex(ap => ap.id === updatedNetworkFail.id);
            if (index !== -1) {
                const newNetworkFailes = [...networkFailures];
                newNetworkFailes[index] = { ...newNetworkFailes[index], ...updatedNetworkFail };

                return {
                    ...prevState,
                    network_failures: newNetworkFailes
                };
            }

            // If the UUID is not found, return the original state
            return prevState;
        });
    };

    const updateNetworkFailures = (updatedNetworkFailures) => {

        setGsmAnswers(prevState => ({
            ...prevState,
            network_failures: [
                ...prevState.network_failures,
                updatedNetworkFailures
            ]
        }));
    };

    const handleAddedItemClick = (itemData) => {

        setActiveMeshsModalData(itemData);
        setModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const propertyNames = name.split('.');
        let updatedState = { ...gsmAnswers };
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

        setGsmAnswers({ ...updatedState });

    };

    const handleCheckboxChange = (e) => {

        const { name, checked } = e.target;
        const propertyNames = name.split('.');
        let updatedState = { ...gsmAnswers };
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
        setGsmAnswers({ ...updatedState });

    };

    const handleDeleteItem = (index) => {
        // Update the list to remove the item at the given index
        const updatedList = gsmAnswers?.network_failures.filter((_, i) => i !== index);

        // Assuming you're using state to manage the list
        setGsmAnswers(prevState => ({
            ...prevState,
            network_failures: updatedList,
        }));
    };

    const CloseNerworkFailureModal = () => {
        setNetworkFailursModalOpen(false);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Description'
                        value={gsmAnswers.communication_protocol_description}
                        name='communication_protocol_description'
                        error={!!errors.communication_protocol_description}
                        helperText={errors.communication_protocol_description ?? ''}
                        onChange={handleInputChange}
                        id='1'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        name='network_name'
                        value={gsmAnswers.network_name}
                        error={!!errors.network_name}
                        helperText={errors.network_name ?? ''}
                        onChange={handleInputChange}
                        label='Network Name'
                        id='2'
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
                                checked={gsmAnswers.already_implemented}
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
                                    inputProps={{ 'aria-label': 'Firmware Integrity Check' }}
                                    name='firmware_integrity_check'
                                    checked={gsmAnswers.firmware_integrity_check}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label={'Firmware Integrity Check'}
                        />
                    </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                inputProps={{ 'aria-label': 'Log Monitor Enabled' }}
                                name='log_monitoring_enabled'
                                checked={gsmAnswers.log_monitoring_enabled}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'Log Monitor Enabled'}
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
                                checked={gsmAnswers.redundancy_measures}
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
                                checked={gsmAnswers.intrusion_detection_system}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'Intrusion Detection System'}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='number'
                        name='securityAuditFrequencyInYears'
                        value={gsmAnswers?.securityAuditFrequencyInYears}
                        error={!!errors.securityAuditFrequencyInYears}
                        helperText={errors.securityAuditFrequencyInYears ?? ''}
                        onChange={handleInputChange}
                        label='Security Audit Frequency In Years'
                        id='8'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <TextField
                            type='number'
                            label='Lifetime in Years'
                            id='87'
                            value={gsmAnswers?.lifetime_in_years}
                            name='lifetime_in_years'
                            onChange={handleInputChange}
                            error={!!errors.lifetime_in_years}
                            helperText={errors.lifetime_in_years ?? ''}
                        />
                    </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Box component={Paper} elevation={2} p={2} style={{ textAlign: 'center', gridColumn: '1 / -1' }} >
                    <Typography variant="h6">{'Gsm Nodes'}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Button
                    variant="outlined"
                    onClick={() => showModal()}
                    style={{ color: 'black', borderColor: 'black', width: '100%', height: '56px' }}>
                    {'Add Gsm Node'}
                </Button>
                {
                    gsmAnswers?.gsmNodes?.map((itemData, index) => (
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
                            {itemData.device_name}
                        </li>
                    ))}
            </Grid>
            <Grid item xs={12} sm={6}>
                <Button
                    variant="outlined"
                    onClick={() => showNetworkFailuresModal()}
                    style={{ color: 'black', borderColor: 'black', width: '100%', height: '56px' }}>
                    {'Add NETWORK FAILURES'}
                </Button>
                {
                    gsmAnswers?.network_failures?.map((itemData, index) => (
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
                                checked={gsmAnswers.at_rest}
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
                                checked={gsmAnswers.in_transit}
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
            <HubModal open={modalOpen} handleClose={closeModal} updateHub={updateHub} hubData={activeMeshsModalData} updateAccessPointByUUID={updateAccessPointByUUID} />
            <NetworkFailures open={networkFailursModalOpen}
                handleClose={CloseNerworkFailureModal}
                updateNetworkFailures={updateNetworkFailures}
                networkFailureData={activeNetworkFailuresModalData} updateNetworkFailersByUUID={updateNetworkFailersByUUID} causeOffailures={cause_of_failures} />
        </Grid>
    )
};

export default Gsm;