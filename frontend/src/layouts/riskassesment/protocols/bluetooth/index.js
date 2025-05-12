import {
    Button, Select,
    MenuItem, FormControl, InputLabel, TextField, Box,
    Grid, Checkbox, FormControlLabel,
    Typography, Paper, FormHelperText, Snackbar, Alert, Tooltip
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import HubModal from './hub-modal';
import NetworkFailures from '../components/network-failures-modal';



const Bluetooth = ({ getProtocolData, protocolData, errors }) => {

    const [modalOpen, setModalOpen] = useState(false);

    const [activeMeshsModalData, setActiveMeshsModalData] = useState({});
    const [activeNetworkFailuresModalData, setActiveNetworkFailuresModalData] = useState({});

    const [networkFailursModalOpen, setNetworkFailursModalOpen] = useState(false);

    const [bluetoothAnswers, setBluetoothAnswers] = useState({
        protocol: 'bluetooth',
        communication_protocol_description: protocolData.communication_protocol_description ?? '',
        mesh_name: protocolData.mesh_name ?? '',
        maximum_supported_devices: protocolData.maximum_supported_devices ?? '',
        already_implemented: protocolData.already_implemented ?? false,
        log_monitoring_enabled: protocolData.log_monitoring_enabled ?? false,
        redundancy_measures: protocolData.redundancy_measures ?? false,
        intrusion_detection_system: protocolData.intrusion_detection_system ?? false,
        firmware_integrity_check: protocolData.firmware_integrity_check ?? false,
        security_audit_frequency_in_years: protocolData.security_audit_frequency_in_years ?? '',
        access_control_mechanism: protocolData.access_control_mechanism ?? '',
        backbone_network_speed_in_mpbs: protocolData.backbone_network_speed_in_mpbs ?? '',
        riskAssessmentId: protocolData.riskAssessmentId ?? null,
        in_transit: protocolData.in_transit ?? false,
        at_rest: protocolData.at_rest ?? false,
        mesh_details: {
            deployment_details: {
                topology_type: protocolData?.mesh_details?.deployment_details?.topology_type ?? '',
                access_points: protocolData?.mesh_details?.deployment_details?.access_points ?? [],
                area_coverage_in_meters: protocolData?.mesh_details?.deployment_details?.area_coverage_in_meters ?? '',
                typical_latency_in_ms: protocolData?.mesh_details?.deployment_details?.typical_latency_in_ms ?? '',
                bandwidth_in_mbps: protocolData?.mesh_details?.deployment_details?.bandwidth_in_mbps ?? '',
                lifetime_in_years: protocolData?.mesh_details?.deployment_details?.lifetime_in_years ?? '',
                level_of_interference: protocolData?.mesh_details?.deployment_details?.level_of_interference ?? '',
            },
            network_failures: protocolData?.mesh_details?.network_failures ?? [],
            other_connected_devices: protocolData?.mesh_details?.other_connected_devices ?? "0"
        }
    });

    const cause_of_failures = [{ value: "HardwareIssue", displayValue: "Hardware Issue" },
    { value: "Interference", displayValue: "Interference" },
    { value: "Overload", displayValue: "Overload" },
    { value: "SoftwareFirmware", displayValue: "Software Firmware" },
    { value: "Power", displayValue: "Power" },
    { value: "Environment", displayValue: "Environment" },
    { value: "ConfigurationError", displayValue: "Configuration Error" }];

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        if (errors.access_points && !bluetoothAnswers.mesh_details.deployment_details.access_points.length) {
            setSnackbarMessage("Please add HUB");
            setSnackbarOpen(true);
            errors.access_points = undefined;
        }

        getProtocolData(bluetoothAnswers);
    }, [bluetoothAnswers, errors]);


    const showModal = () => {
        setActiveMeshsModalData({});
        setModalOpen(true);
    };

    const closeModal = (modalModel) => {

        var m = modalModel;
        setModalOpen(false); // Close the modal
    };

    const updateHub = (updatedAccessPoints) => {
        setBluetoothAnswers(prevState => ({
            ...prevState,
            mesh_details: {
                ...prevState.mesh_details,
                deployment_details: {
                    ...prevState.mesh_details.deployment_details,
                    access_points: [
                        ...prevState.mesh_details.deployment_details.access_points,
                        updatedAccessPoints
                    ]
                }
            }
        }));
    };

    const updateAccessPointByUUID = (updatedAccessPoint) => {
        setBluetoothAnswers(prevState => {
            const accessPoints = prevState.mesh_details.deployment_details.access_points;
            const index = accessPoints.findIndex(ap => ap.id === updatedAccessPoint.id);
            if (index !== -1) {
                const newAccessPoints = [...accessPoints];
                newAccessPoints[index] = { ...newAccessPoints[index], ...updatedAccessPoint };

                return {
                    ...prevState,
                    mesh_details: {
                        ...prevState.mesh_details,
                        deployment_details: {
                            ...prevState.mesh_details.deployment_details,
                            access_points: newAccessPoints
                        }
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
        let updatedState = { ...bluetoothAnswers };
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

        setBluetoothAnswers({ ...updatedState });

    };

    const handleCheckboxChange = (e) => {

        const { name, checked } = e.target;
        const propertyNames = name.split('.');
        let updatedState = { ...bluetoothAnswers };
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
        setBluetoothAnswers({ ...updatedState });

    };

    const CloseNerworkFailureModal = () => {
        setNetworkFailursModalOpen(false);
    };

    const updateNetworkFailures = (updatedNetworkFailures) => {

        setBluetoothAnswers(prevState => ({
            ...prevState,
            mesh_details: {
                ...prevState.mesh_details,
                network_failures: [
                    ...prevState.mesh_details.network_failures,
                    updatedNetworkFailures
                ]
            }
        }));
    };

    const updateNetworkFailersByUUID = (updatedNetworkFail) => {
        setBluetoothAnswers(prevState => {
            const networkFailures = prevState.mesh_details.network_failures;
            const index = networkFailures.findIndex(ap => ap.id === updatedNetworkFail.id);
            if (index !== -1) {
                const newNetworkFailes = [...networkFailures];
                newNetworkFailes[index] = { ...newNetworkFailes[index], ...updatedNetworkFail };

                return {
                    ...prevState,
                    mesh_details: {
                        ...prevState.mesh_details,
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

    const handleDeleteItem = (index) => {
        // Update the list to remove the item at the given index
        const updatedList = bluetoothAnswers.mesh_details?.network_failures.filter((_, i) => i !== index);

        // Assuming you're using state to manage the list
        setBluetoothAnswers(prevState => ({
            ...prevState,
            mesh_details: {
                ...prevState.mesh_details,
                network_failures: updatedList,
            },
        }));
    };


    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Provide a brief description of the communication protocol.">
                    <FormControl fullWidth>
                        <TextField
                            type='text'
                            label='Description'
                            value={bluetoothAnswers.communication_protocol_description}
                            name='communication_protocol_description'
                            error={!!errors.communication_protocol_description}
                            helperText={errors.communication_protocol_description ?? ''}
                            onChange={handleInputChange}
                            id='1'
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enter the name of the mesh network.">
                    <FormControl fullWidth>
                        <TextField
                            type='text'
                            name='mesh_name'
                            value={bluetoothAnswers.mesh_name}
                            error={!!errors.mesh_name}
                            helperText={errors.mesh_name ?? ''}
                            onChange={handleInputChange}
                            label='Mesh Name'
                            id='2'
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enter the maximum number of devices supported by the mesh.">
                    <FormControl fullWidth>
                        <TextField
                            type='number'
                            name='maximum_supported_devices'
                            value={bluetoothAnswers.maximum_supported_devices}
                            error={!!errors.maximum_supported_devices}
                            helperText={errors.maximum_supported_devices ?? ''}
                            onChange={handleInputChange}
                            label='Maximum Supported Devices'
                            id='3'
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enable this checkbox if the protocol has already been implemented.">
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    inputProps={{ 'aria-label': 'Already Implemented' }}
                                    name='already_implemented'
                                    checked={bluetoothAnswers.already_implemented}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label={'Already Implemented'}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enable this checkbox to indicate if log monitoring is active.">
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    inputProps={{ 'aria-label': 'Log Monitor Enabled' }}
                                    name='log_monitoring_enabled'
                                    checked={bluetoothAnswers.log_monitoring_enabled}
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
                                    checked={bluetoothAnswers.redundancy_measures}
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
                                    checked={bluetoothAnswers.intrusion_detection_system}
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
                                    checked={bluetoothAnswers.firmware_integrity_check}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label={'Firmware Integrity Check'}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enter the frequency of security audits in years.">
                    <FormControl fullWidth>
                        <TextField
                            type='number'
                            name='security_audit_frequency_in_years'
                            value={bluetoothAnswers?.security_audit_frequency_in_years}
                            error={!!errors.security_audit_frequency_in_years}
                            helperText={errors.security_audit_frequency_in_years ?? ''}
                            onChange={handleInputChange}
                            label='Security Audit Frequency In Years'
                            id='8'
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Select the access control mechanism used for the network.">
                    <FormControl fullWidth margin="normal">
                        <InputLabel>{'Access Control Mechanism'}</InputLabel>
                        <Select
                            label={'Access Control Mechanism'}
                            error={!!errors.access_control_mechanism}
                            name='access_control_mechanism'
                            value={bluetoothAnswers?.access_control_mechanism}
                            onChange={(e) => handleInputChange(e)}
                            id='732432'
                        >
                            <MenuItem key={'Rbac'} value={'Rbac'}>{'RBAC'}</MenuItem>
                            <MenuItem key={'Mfa'} value={'Mfa'}>{'MFA'}</MenuItem>
                        </Select>
                        {errors.access_control_mechanism && (
                            <FormHelperText sx={{ color: 'red' }}>{errors.access_control_mechanism}</FormHelperText>
                        )}
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enter the backbone network speed in Mbps.">
                    <FormControl fullWidth>
                        <TextField
                            type='number'
                            name='backbone_network_speed_in_mpbs'
                            value={bluetoothAnswers?.backbone_network_speed_in_mpbs}
                            error={!!errors.backbone_network_speed_in_mpbs}
                            helperText={errors.backbone_network_speed_in_mpbs ?? ''}
                            onChange={handleInputChange}
                            label='Backbone Network Speed in Mbps'
                            id='9'
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Box component={Paper} elevation={2} p={2} style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                    <Typography variant="h6">{'Mesh Details'}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Click here to add hubs for bluetooth.">
                    <Button
                        variant="outlined"
                        onClick={() => showModal()}
                        style={{ color: 'black', borderColor: 'black', width: '100%', height: '56px' }}>
                        {'Add HUB'}
                    </Button>
                </Tooltip>

                {
                    bluetoothAnswers.mesh_details?.deployment_details?.access_points?.map((itemData, index) => (
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
                    ))
                }
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enter the total area coverage of the mesh in meters.">
                    <FormControl fullWidth>
                        <TextField
                            type='number'
                            name='mesh_details.deployment_details.area_coverage_in_meters'
                            value={bluetoothAnswers?.mesh_details?.deployment_details?.area_coverage_in_meters}
                            error={!!errors.area_coverage_in_meters}
                            helperText={errors.area_coverage_in_meters ?? ''}
                            onChange={handleInputChange}
                            label='Area Coverage in Meters'
                            id='6'
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Other Connected Devices.">
                    <FormControl fullWidth>
                        <TextField
                            type='number'
                            label='Other Connected Devices'
                            id='64'
                            value={bluetoothAnswers?.mesh_details?.other_connected_devices}
                            name='mesh_details.other_connected_devices'
                            onChange={handleInputChange}
                            error={!!errors.other_connected_devices}
                            helperText={errors.other_connected_devices ?? ''}
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Select the level of interference affecting the mesh network.">
                    <FormControl fullWidth>
                        <InputLabel>{'Level Of Interference'}</InputLabel>
                        <Select
                            label={'Level Of Interference'}
                            id='7'
                            value={bluetoothAnswers?.mesh_details?.deployment_details?.level_of_interference}
                            error={!!errors.level_of_interference}
                            name='mesh_details.deployment_details.level_of_interference'
                            onChange={(e) => handleInputChange(e)}
                        >
                            <MenuItem key={'low'} value={'low'}>{'Low'}</MenuItem>
                            <MenuItem key={'medium'} value={'medium'}>{'Medium'}</MenuItem>
                            <MenuItem key={'high'} value={'high'}>{'High'}</MenuItem>
                        </Select>
                        {errors.level_of_interference && (
                            <FormHelperText sx={{ color: 'red' }}>{errors.level_of_interference}</FormHelperText>
                        )}
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enter the expected operational lifetime of the mesh deployment in years.">
                    <FormControl fullWidth>
                        <TextField
                            type='number'
                            name='mesh_details.deployment_details.lifetime_in_years'
                            error={!!errors.lifetime_in_years}
                            helperText={errors.lifetime_in_years ?? ''}
                            value={bluetoothAnswers?.mesh_details?.deployment_details?.lifetime_in_years}
                            onChange={handleInputChange}
                            label='Lifetime in Years'
                            id='8'
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Provide the typical round-trip time latency for the mesh network in milliseconds.">
                    <FormControl fullWidth>
                        <TextField
                            type='number'
                            error={!!errors.typical_latency_in_ms}
                            helperText={errors.typical_latency_in_ms ?? ''}
                            name='mesh_details.deployment_details.typical_latency_in_ms'
                            value={bluetoothAnswers?.mesh_details?.deployment_details?.typical_latency_in_ms}
                            onChange={handleInputChange}
                            label='Typical Latency RTT In Ms'
                            id='9'
                        />
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Select the topology type of the mesh network (e.g., Star, Point-to-Point).">
                    <FormControl fullWidth margin="normal">
                        <InputLabel>{'Topology Type'}</InputLabel>
                        <Select
                            label={'Topology Type'}
                            error={!!errors.topology_type}
                            name='mesh_details.deployment_details.topology_type'
                            value={bluetoothAnswers?.mesh_details?.deployment_details?.topology_type}
                            onChange={(e) => handleInputChange(e)}
                            id='7324'
                        >
                            <MenuItem key={'star'} value={'star'}>{'Star'}</MenuItem>
                            <MenuItem key={'pointToPoint'} value={'pointToPoint'}>{'Point-to-Point'}</MenuItem>
                            <MenuItem key={'mesh'} value={'mesh'}>{'Mesh'}</MenuItem>
                        </Select>
                        {errors.topology_type && (
                            <FormHelperText sx={{ color: 'red' }}>{errors.topology_type}</FormHelperText>
                        )}
                    </FormControl>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Tooltip title="Enter the bandwidth capacity of the mesh network in Megabits per second.">
                    <FormControl fullWidth>
                        <TextField
                            type='number'
                            name='mesh_details.deployment_details.bandwidth_in_mbps'
                            error={!!errors.bandwidth_in_mbps}
                            helperText={errors.bandwidth_in_mbps ?? ''}
                            value={bluetoothAnswers?.mesh_details?.deployment_details?.bandwidth_in_mbps}
                            onChange={handleInputChange}
                            label='Bandwidth In Mbps'
                            id='11'
                        />
                    </FormControl>
                </Tooltip>
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
                    bluetoothAnswers.mesh_details?.network_failures?.map((itemData, index) => (
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
                                checked={bluetoothAnswers.at_rest}
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
                                checked={bluetoothAnswers.in_transit}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={'In Transit'}
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

export default Bluetooth;