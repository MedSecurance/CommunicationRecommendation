import {
    Button, Select,
    MenuItem, FormControl, InputLabel, TextField, Box,
    Grid, Checkbox, FormControlLabel,
    Typography, Paper, FormHelperText, Snackbar, Alert
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import GateWayModal from './gateway-modal';


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
        network_details: {
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

    useEffect(() => {
        if(errors.gateways){
            setSnackbarMessage("Please add gateways");
            setSnackbarOpen(true);
        }
        getProtocolData(lorawanAnswers);
    }, [lorawanAnswers, errors]);

    const showModal = () => {
        setActiveMeshsModalData({});
        setModalOpen(true);
    };

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

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
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        name='network_details.deployment_country'
                        value={lorawanAnswers?.network_details?.deployment_country}
                        onChange={handleInputChange}
                        label='Deployment Country'
                        id='6'
                        error={!!errors.deployment_country}
                        helperText={errors.deployment_country ?? ''}
                    />
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
                        error={!!errors.networkServerBandwidth}
                        helperText={errors.networkServerBandwidth ?? ''}
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
            <Grid item xs={12} style={{ textAlign: 'left', gridColumn: 'auto' }}>
                <Typography variant="h6">{'IoMt Details'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='number'
                        label='Number Of Sensors'
                        id='12'
                        value={lorawanAnswers?.iomt_details?.number_of_sensors}
                        onChange={handleInputChange}
                        name='iomt_details.number_of_sensors'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='number'
                        label='Number Of Connected Devices'
                        id='13'
                        value={lorawanAnswers?.iomt_details?.number_of_connected_devices}
                        onChange={handleInputChange}
                        name='iomt_details.number_of_connected_devices'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='number'
                        label='Number Of Actuators'
                        id='14'
                        value={lorawanAnswers?.iomt_details?.number_of_actuators}
                        onChange={handleInputChange}
                        name='iomt_details.number_of_actuators'
                    />
                </FormControl>
            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <GateWayModal open={modalOpen} handleClose={closeModal} updateHub={updateHub} hubData={activeMeshsModalData} updateAccessPointByUUID={updateAccessPointByUUID} />
        </Grid>
    )
};



export default LoraWAN;