import React, { useState, useEffect, useContext } from 'react';

import {
    Grid, Button, TextField, FormControl, Card, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Box, Paper, Typography, FormHelperText,
    Snackbar, Alert
} from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { GetDeviceDetails, UpdateDevice } from "services/device-manager-service";
import MDTypography from "components/MDTypography";
import { useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { KeycloakContext } from '../../../../keycloak-provider';
import { ValidateFromData, SetProtocolsData } from '../helpers/validations'
import { standardsUtilizedItems, gsmGenerationsMapping, encryptionItems } from '../helpers/data-helper';
import { hasPermission } from '../../../../authentication-helpers/role-validator'
import {useFormHandlers} from "../../../../hooks/useFormHandlers";


const DeviceDetails = () => {

    const { getAuthHeaders, roles } = useContext(KeycloakContext);

    const canUpdate = hasPermission(roles, 'DeviceManager', 'update');


    // Fetch data from API
    const { deviceId } = useParams();

    const [errors, setErrors] = useState({});

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarMessageSeverity, setSnackbarMessageSeverity] = useState('');
    const [frequenciesToSelect, setFrequenciesToSelect] = useState([]);
    const [encryptionToSelect, setEncryptionToSelect] = useState([]);

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        const fetchData = async (deviceId, getAuthHeaders) => {
            try {
                const response = await GetDeviceDetails(deviceId, getAuthHeaders);

                setFormData({
                    name: response.name,
                    serialNumber: response.serialNumber,
                    type: response.type,
                    manufacturer: response.manufacturer,
                    description: response.description,
                    manufacturingDate: response.manufacturingDate ? new Date(response.manufacturingDate) : new Date(),
                    communicationProtocol: response.communicationProtocol,
                    networkName: response.networkName,
                    doctorId: response.doctorId,
                    location: response.location,
                    validated: response.validated,
                    standardCompliance: response.standardCompliance,
                    supportedCommunicationProtocols: response.supportedCommunicationProtocols ?? [],
                    wifiSpecs: {
                        ipAddress: response.wifiSpecs?.ipAddress ?? "",
                        encryption: response.wifiSpecs?.encryption ?? "",
                        firmware: response.wifiSpecs?.firmware ?? "",
                        macAddress: response.wifiSpecs?.macAddress ?? "",
                        firmwareDate: response.wifiSpecs?.firmwareDate ? new Date(response.wifiSpecs?.firmwareDate) : new Date(),
                        supportedStandards: response.wifiSpecs?.supportedStandards ?? [],
                        supportedFrequencies: response.wifiSpecs?.supportedFrequencies ?? [],
                        standardUtilized: response.wifiSpecs?.standardUtilized,
                        frequencyUtilized: response.wifiSpecs?.frequencyUtilized,
                    },
                    gsmSpecs: {
                        firmware: response.gsmSpecs?.firmware ?? "",
                        macAddress: response.gsmSpecs?.macAddress ?? "",
                        firmwareDate: response.gsmSpecs?.firmwareDate ? new Date(response.gsmSpecs?.firmwareDate) : new Date(),
                        supportedGenerations: response.gsmSpecs?.supportedGenerations ?? [],
                        utilizedGeneration: response.gsmSpecs?.utilizedGeneration,
                    },
                    bluetoothSpecs: {
                        firmware: response.bluetoothSpecs?.firmware ?? "",
                        macAddress: response.bluetoothSpecs?.macAddress ?? "",
                        firmwareDate: response.bluetoothSpecs?.firmwareDate ? new Date(response.bluetoothSpecs?.firmwareDate) : new Date(),
                        supportedAntenas: response.bluetoothSpecs?.supportedAntenas ?? [],
                        supportedAuthenticationMethods: response.bluetoothSpecs?.supportedAuthenticationMethods ?? [],
                        supportedDataIntegrities: response.bluetoothSpecs?.supportedDataIntegrities ?? [],
                        supportedTopologies: response.bluetoothSpecs?.supportedTopologies ?? [],
                        supportedAccessControlMechanisms: response.bluetoothSpecs?.supportedAccessControlMechanisms ?? [],
                        supportedVersions: response.bluetoothSpecs?.supportedVersions?.map(value => {
                            // Convert to a decimal if it's a whole number with a trailing zero
                            return value.toFixed(1);
                        }) ?? [],
                        utilizedAntena: "",
                        utilizedAuthenticationMethod: "",
                        utilizedDataIntegrity: "",
                        utilizedTopology: "",
                        utilizedAccessControlMechanism: "",
                        utilizedVersion: response.bluetoothSpecs?.utilizedVersion.toFixed(1).toString() ?? '',
                    },
                    lorawanSpecs: {
                        macAddress: response.lorawanSpecs?.macAddress ?? "",
                        firmware: response.lorawanSpecs?.firmware ?? "",
                        firmwareDate: response.lorawanSpecs?.firmwareDate ? new Date(response.lorawanSpecs?.firmwareDate) : new Date(),
                        supportedFrequencyBands: response.lorawanSpecs?.supportedFrequencyBands ?? [],
                        utilizedFrequencyBand: response.lorawanSpecs?.utilizedFrequencyBand ?? "",
                        physicalLocation: response.lorawanSpecs?.physicalLocation ?? "",
                        adaptiveDataRate: response.lorawanSpecs?.adaptiveDataRate ?? false,
                        joinMode: response.lorawanSpecs?.joinMode ?? ""
                    }
                });

                //Set wifi standards utilized freg
                const frequenciesSupported = standardsUtilizedItems[response.wifiSpecs?.standardUtilized];
                if (frequenciesSupported)
                    setFrequenciesToSelect(frequenciesSupported);

                if (response.wifiSpecs?.standardUtilized && response.wifiSpecs?.frequencyUtilized) {
                    const encryptionSupported = encryptionItems[response.wifiSpecs.standardUtilized][response.wifiSpecs?.frequencyUtilized];
                    setEncryptionToSelect(encryptionSupported);
                }

            } catch (error) {

                console.error('Error fetching data:', error);
                setSnackbarMessage("Error fetching data");
                setSnackbarMessageSeverity("error");
                setSnackbarOpen(true);
            }
        };

        fetchData(deviceId, getAuthHeaders);

    }, []);

    const handleDateChange = (date) => {
        setFormData({ ...formData, manufacturingDate: date });
    };

    const handleProtocolUtilizedChange = (e) => {
        const protocol = e.target.value;
        setFormData({ ...formData, communicationProtocol: protocol });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const newErrors = ValidateFromData(formData);

            setErrors(newErrors);

            if (Object.keys(newErrors).length > 0) {
                return;
            }

            SetProtocolsData(formData);

            await UpdateDevice(formData, deviceId, getAuthHeaders);

            setSnackbarMessage("Update Successful");
            setSnackbarMessageSeverity("success");
            setSnackbarOpen(true);

        } catch (error) {
            console.error('Error updating data:', error);
            setSnackbarMessage("Error updating data");
            setSnackbarMessageSeverity("error");
            setSnackbarOpen(true);

        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUtilizedFregChange = (e, specKey, field) => {

        const value = e.target.value;

        const encryptionSupported = encryptionItems[formData.wifiSpecs.standardUtilized][value];

        setEncryptionToSelect(encryptionSupported);

        setFormData({
            ...formData,
            [specKey]: {
                ...formData[specKey],
                [field]: Array.isArray(value) ? value : e.target.value,
                ["encryption"]: ""
            }
        });
    };

    const handleProtocolChange = (e) => {
        const protocol = e.target.name;
        const isChecked = e.target.checked;

        setFormData((prevState) => {
            let newSupportedProtocols = isChecked
                ? [...prevState.supportedCommunicationProtocols, protocol]
                : prevState.supportedCommunicationProtocols.filter(p => p !== protocol);

            let newCommunicationProtocol = prevState.communicationProtocol;

            // Remove from communicationProtocol if it matches the unchecked protocol
            if (!isChecked && prevState.communicationProtocol === protocol) {
                newCommunicationProtocol = '';
            }

            return {
                ...prevState,
                supportedCommunicationProtocols: newSupportedProtocols,
                communicationProtocol: newCommunicationProtocol
            };
        });

        if (formData.gsmSpecs === null) {
            setFormData(prevState => ({
                ...prevState,
                ["gsmSpecs"]: {
                    firmware: "",
                    macAddress: "",
                    firmwareDate: new Date(),
                    supportedGenerations: [],
                    utilizedGeneration: "",
                },
            }));
        }

        if (formData.bluetoothSpecs === null) {
            setFormData(prevState => ({
                ...prevState,
                ["bluetoothSpecs"]: {
                    firmware: "",
                    firmwareDate: new Date(),
                    supportedAntenas: [],
                    supportedAuthenticationMethods: [],
                    supportedDataIntegrities: [],
                    supportedTopologies: [],
                    supportedAccessControlMechanisms: [],
                    supportedVersions: [],
                    utilizedAntena: "",
                    utilizedAuthenticationMethod: "",
                    utilizedDataIntegrity: "",
                    utilizedTopology: "",
                    utilizedAccessControlMechanism: "",
                    utilizedVersion: ""
                },
            }));
        }

        if (formData.wifiSpecs === null) {
            setFormData(prevState => ({
                ...prevState,
                ["wifiSpecs"]: {
                    ipAddress: "",
                    encryption: "",
                    firmware: "",
                    firmwareDate: new Date(),
                    supportedStandards: [],
                    supportedFrequencies: [],
                    standardUtilized: "",
                    frequencyUtilized: "",
                },
            }));
        }

        if (formData.lorawanSpecs === null) {
            setFormData(prevState => ({
                ...prevState,
                ["lorawanSpecs"]: {
                    macAddress: "",
                    firmware: "",
                    firmwareDate: new Date(),
                    supportedFrequencyBands: [],
                    utilizedFrequencyBand: "",
                    physicalLocation: "",
                    adaptiveDataRate: false,
                    joinMode: ""
                },
            }));
        }
    };

    const [formData, setFormData] = useState({
        name: '',
        serialNumber: '',
        type: '',
        manufacturer: '',
        description: '',
        manufacturingDate: new Date(),
        communicationProtocol: '',
        networkName: '',
        doctorId: '',
        location: '',
        validated: false,
        standardCompliance: false,
        supportedCommunicationProtocols: [],
        wifiSpecs: {
            ipAddress: "",
            encryption: "",
            firmware: "",
            firmwareDate: new Date(),
            supportedStandards: [],
            supportedFrequencies: [],
            standardUtilized: "",
            frequencyUtilized: "",
        },
        gsmSpecs: {
            firmware: "",
            firmwareDate: new Date(),
            supportedGenerations: [],
            utilizedGeneration: "",
        },
        bluetoothSpecs: {
            firmware: "",
            firmwareDate: new Date(),
            supportedAntenas: [],
            supportedAuthenticationMethods: [],
            supportedDataIntegrities: [],
            supportedTopologies: [],
            supportedAccessControlMechanisms: [],
            supportedVersions: [],
            utilizedAntena: "",
            utilizedAuthenticationMethod: "",
            utilizedDataIntegrity: "",
            utilizedTopology: "",
            utilizedAccessControlMechanism: "",
            utilizedVersion: ""
        },
        lorawanSpecs: {
            macAddress: "",
            firmware: "",
            firmwareDate: new Date(),
            supportedFrequencyBands: [],
            utilizedFrequencyBand: "",
            physicalLocation: "",
            adaptiveDataRate: false,
            joinMode: ""
        }
    }); // State to manage form data

    const handleSpecChange = (e, specKey, field) => {
        const value = e.target.value;
        setFormData({
            ...formData,
            [specKey]: {
                ...formData[specKey],
                [field]: Array.isArray(value) ? value : e.target.value
            }
        });
    };

    const { handleCheckboxChange } = useFormHandlers(setFormData);

    const handleUtilizedStandardChange = (e, specKey, field) => {

        const value = e.target.value;

        const frequenciesSupported = standardsUtilizedItems[value];

        setEncryptionToSelect([]);
        setFrequenciesToSelect(frequenciesSupported);

        setFormData({
            ...formData,
            [specKey]: {
                ...formData[specKey],
                [field]: Array.isArray(value) ? value : e.target.value,
                ["frequencyUtilized"]: ""
            }
        });

    };

    const renderProtocolFields = () => {
        return (
            <>
                {formData.supportedCommunicationProtocols?.includes('WiFi') && (
                    <>
                        <Grid item xs={12}>
                            <Box component={Paper} elevation={2} p={2} style={{ textAlign: 'center', gridColumn: '1 / -1' }} >
                                <Typography variant="h6">{'WiFi'}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Ip Adress"
                                    type="text"
                                    disabled={!canUpdate}
                                    value={formData.wifiSpecs.ipAddress || ''}
                                    onChange={(e) => handleSpecChange(e, 'wifiSpecs', 'ipAddress')}
                                    error={!!errors.wifiSpecs?.ipAddress}
                                    helperText={errors.wifiSpecs?.ipAddress ?? ''}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="MacAdress"
                                    type="text"
                                    disabled={!canUpdate}
                                    value={formData.wifiSpecs.macAddress || ''}
                                    onChange={(e) => handleSpecChange(e, 'wifiSpecs', 'macAddress')}
                                    error={!!errors.wifiSpecs?.macAddress}
                                    helperText={errors.wifiSpecs?.macAddress ?? ''}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Firmware"
                                    disabled={!canUpdate}
                                    value={formData.wifiSpecs.firmware || ''}
                                    onChange={(e) => handleSpecChange(e, 'wifiSpecs', 'firmware')}
                                    error={!!errors.wifiSpecs?.firmware}
                                    helperText={errors.wifiSpecs?.firmware ?? ''}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Firmware Date"
                                        disabled={!canUpdate}
                                        value={formData.wifiSpecs.firmwareDate || new Date()}
                                        onChange={(date) => handleSpecChange({ target: { value: date } }, 'wifiSpecs', 'firmwareDate')}
                                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{'Encryption'}</InputLabel>
                                <Select
                                    label="Encryption"
                                    disabled={!canUpdate}
                                    value={formData.wifiSpecs.encryption}
                                    onChange={(e) => handleSpecChange(e, 'wifiSpecs', 'encryption')}
                                >
                                    {
                                        encryptionToSelect?.map((itemData) => (
                                            <MenuItem key={itemData.value} value={itemData.value}>{itemData.displayValue}</MenuItem>

                                        ))}

                                </Select>
                                {errors.wifiSpecs?.encryption && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.wifiSpecs?.encryption}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Supported Standards"}</InputLabel>
                                <Select
                                    label="Supported Standards"
                                    disabled={!canUpdate}
                                    value={formData.wifiSpecs.supportedStandards || []}
                                    onChange={(e) => handleSpecChange(e, 'wifiSpecs', 'supportedStandards')}
                                    multiple
                                >
                                    <MenuItem value="_802_11a">802.11a</MenuItem>
                                    <MenuItem value="_802_11b">802.11b</MenuItem>
                                    <MenuItem value="_802_11g">802.11g</MenuItem>
                                    <MenuItem value="_802_11n">802.11n</MenuItem>
                                    <MenuItem value="_802_11ac">802.11ac</MenuItem>
                                    <MenuItem value="_802_11ax">802.11ax</MenuItem>
                                </Select>
                                {errors.wifiSpecs?.supportedStandards && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.wifiSpecs?.supportedStandards}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Supported Frequencies"}</InputLabel>
                                <Select
                                    label="Supported Frequencies"
                                    disabled={!canUpdate}
                                    value={formData.wifiSpecs.supportedFrequencies || []}
                                    onChange={(e) => handleSpecChange(e, 'wifiSpecs', 'supportedFrequencies')}
                                    multiple
                                >
                                    <MenuItem value="_2_4GHz">2.4GHz</MenuItem>
                                    <MenuItem value="_5GHz">5GHz</MenuItem>
                                    <MenuItem value="_6GHz">6GHz</MenuItem>
                                </Select>
                                {errors.wifiSpecs?.supportedFrequencies && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.wifiSpecs?.supportedFrequencies}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Utilized Standard"}</InputLabel>
                                <Select
                                    label="Utilized Standard"
                                    disabled={!canUpdate}
                                    value={formData.wifiSpecs.standardUtilized || []}
                                    onChange={(e) => handleUtilizedStandardChange(e, 'wifiSpecs', 'standardUtilized')}
                                >
                                    {
                                        formData.wifiSpecs.supportedStandards?.map((itemData) => (

                                            <MenuItem key={itemData} value={itemData}>{itemData.slice(1).replace(/_/g, '.')}</MenuItem>

                                        ))}
                                </Select>
                                {errors.wifiSpecs?.standardUtilized && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.wifiSpecs?.standardUtilized}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Utilized Frequencies"}</InputLabel>
                                <Select
                                    label="Utilized Frequencies"
                                    disabled={!canUpdate}
                                    value={formData.wifiSpecs.frequencyUtilized || []}
                                    onChange={(e) => handleUtilizedFregChange(e, 'wifiSpecs', 'frequencyUtilized')}
                                >
                                    {
                                        frequenciesToSelect?.map((itemData) => (
                                            <MenuItem key={itemData.value} value={itemData.value}>{itemData.displayValue}</MenuItem>

                                        ))}
                                </Select>
                                {errors.wifiSpecs?.frequencyUtilized && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.wifiSpecs?.frequencyUtilized}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </>
                )}
                {formData.supportedCommunicationProtocols?.includes('GSM') && (
                    <>
                        <Grid item xs={12}>
                            <Box component={Paper} elevation={2} p={2} style={{ textAlign: 'center', gridColumn: '1 / -1' }} >
                                <Typography variant="h6">{'GSM'}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Firmware"
                                    disabled={!canUpdate}
                                    value={formData.gsmSpecs.firmware || ''}
                                    onChange={(e) => handleSpecChange(e, 'gsmSpecs', 'firmware')}
                                    error={!!errors.gsmSpecs?.firmware}
                                    helperText={errors.gsmSpecs?.firmware ?? ''}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="MacAdress"
                                    type="text"
                                    disabled={!canUpdate}
                                    value={formData.gsmSpecs.macAddress || ''}
                                    onChange={(e) => handleSpecChange(e, 'gsmSpecs', 'macAddress')}
                                    error={!!errors.gsmSpecs?.macAddress}
                                    helperText={errors.gsmSpecs?.macAddress ?? ''}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Firmware Date"
                                        disabled={!canUpdate}
                                        value={formData.gsmSpecs.firmwareDate || new Date()}
                                        onChange={(date) => handleSpecChange({ target: { value: date } }, 'gsmSpecs', 'firmwareDate')}
                                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Supported Generations"}</InputLabel>
                                <Select
                                    label="Supported Generations"
                                    disabled={!canUpdate}
                                    value={formData.gsmSpecs.supportedGenerations || []}
                                    onChange={(e) => handleSpecChange(e, 'gsmSpecs', 'supportedGenerations')}
                                    multiple
                                >
                                    <MenuItem value="ThreeG">3G</MenuItem>
                                    <MenuItem value="FourG">4G</MenuItem>
                                    <MenuItem value="FiveG">5G</MenuItem>
                                </Select>
                                {errors.gsmSpecs?.supportedGenerations && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.gsmSpecs?.supportedGenerations}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Utilized Generations"}</InputLabel>
                                <Select
                                    label="Utilized Generations"
                                    disabled={!canUpdate}
                                    value={formData.gsmSpecs.utilizedGeneration || []}
                                    onChange={(e) => handleSpecChange(e, 'gsmSpecs', 'utilizedGeneration')}
                                >
                                    {
                                        formData.gsmSpecs.supportedGenerations?.map((itemData) => (

                                            <MenuItem key={itemData} value={itemData}>{gsmGenerationsMapping(itemData)}</MenuItem>

                                        ))}
                                </Select>
                                {errors.gsmSpecs?.utilizedGeneration && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.gsmSpecs?.utilizedGeneration}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </>
                )}
                {formData.supportedCommunicationProtocols?.includes('Bluetooth') && (
                    <>
                        <Grid item xs={12}>
                            <Box component={Paper} elevation={2} p={2} style={{ textAlign: 'center', gridColumn: '1 / -1' }} >
                                <Typography variant="h6">{'Bluetooth'}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Firmware"
                                    disabled={!canUpdate}
                                    value={formData.bluetoothSpecs.firmware || ''}
                                    onChange={(e) => handleSpecChange(e, 'bluetoothSpecs', 'firmware')}
                                    error={!!errors.bluetoothSpecs?.firmware}
                                    helperText={errors.bluetoothSpecs?.firmware ?? ''}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="MacAdress"
                                    type="text"
                                    disabled={!canUpdate}
                                    value={formData.bluetoothSpecs.macAddress || ''}
                                    onChange={(e) => handleSpecChange(e, 'bluetoothSpecs', 'macAddress')}
                                    error={!!errors.bluetoothSpecs?.macAddress}
                                    helperText={errors.bluetoothSpecs?.macAddress ?? ''}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Firmware Date"
                                        disabled={!canUpdate}
                                        value={formData.bluetoothSpecs.firmwareDate || new Date()}
                                        onChange={(date) => handleSpecChange({ target: { value: date } }, 'bluetoothSpecs', 'firmwareDate')}
                                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Supported Antenas"}</InputLabel>
                                <Select
                                    label="Supported Antenas"
                                    disabled={!canUpdate}
                                    value={formData.bluetoothSpecs.supportedAntenas || []}
                                    onChange={(e) => handleSpecChange(e, 'bluetoothSpecs', 'supportedAntenas')}
                                    multiple
                                >
                                    <MenuItem value="Chip">Chip</MenuItem>
                                    <MenuItem value="PcbTrace">PcbTrace</MenuItem>
                                    <MenuItem value="Dipole">Dipole</MenuItem>
                                    <MenuItem value="Helical">Helical</MenuItem>
                                    <MenuItem value="Patch">Patch</MenuItem>
                                    <MenuItem value="Whip">Whip</MenuItem>
                                </Select>
                                {errors.bluetoothSpecs?.supportedAntenas && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.bluetoothSpecs?.supportedAntenas}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Supported Authentication Methods"}</InputLabel>
                                <Select
                                    label="Supported Authentication Methods"
                                    disabled={!canUpdate}
                                    value={formData.bluetoothSpecs.supportedAuthenticationMethods || []}
                                    onChange={(e) => handleSpecChange(e, 'bluetoothSpecs', 'supportedAuthenticationMethods')}
                                    multiple
                                >
                                    <MenuItem value="None">None</MenuItem>
                                    <MenuItem value="Passkey">Passkey</MenuItem>
                                    <MenuItem value="NumericComparison">NumericComparison</MenuItem>
                                    <MenuItem value="OutOfBand">OutOfBand</MenuItem>
                                    <MenuItem value="SecureSimplePairing">SecureSimplePairing</MenuItem>
                                </Select>
                                {errors.bluetoothSpecs?.supportedAuthenticationMethods && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.bluetoothSpecs?.supportedAuthenticationMethods}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Supported Data Integrities"}</InputLabel>
                                <Select
                                    label="Supported Data Integrities"
                                    disabled={!canUpdate}
                                    value={formData.bluetoothSpecs.supportedDataIntegrities || []}
                                    onChange={(e) => handleSpecChange(e, 'bluetoothSpecs', 'supportedDataIntegrities')}
                                    multiple
                                >
                                    <MenuItem value="None">None</MenuItem>
                                    <MenuItem value="Crc">Crc</MenuItem>
                                    <MenuItem value="Mac">Mac</MenuItem>
                                </Select>
                                {errors.bluetoothSpecs?.supportedDataIntegrities && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.bluetoothSpecs?.supportedDataIntegrities}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Supported Topologies"}</InputLabel>
                                <Select
                                    label="Supported Topologies"
                                    disabled={!canUpdate}
                                    value={formData.bluetoothSpecs.supportedTopologies || []}
                                    onChange={(e) => handleSpecChange(e, 'bluetoothSpecs', 'supportedTopologies')}
                                    multiple
                                >
                                    <MenuItem value="PointToPoint">PointToPoint</MenuItem>
                                    <MenuItem value="Star">Star</MenuItem>
                                    <MenuItem value="Mesh">Mesh</MenuItem>
                                </Select>
                                {errors.bluetoothSpecs?.supportedTopologies && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.bluetoothSpecs?.supportedTopologies}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Supported AccessControl Mechanisms"}</InputLabel>
                                <Select
                                    label="Supported AccessControl Mechanisms"
                                    disabled={!canUpdate}
                                    value={formData.bluetoothSpecs.supportedAccessControlMechanisms || []}
                                    onChange={(e) => handleSpecChange(e, 'bluetoothSpecs', 'supportedAccessControlMechanisms')}
                                    multiple
                                >
                                    <MenuItem value="Rbac">Rbac</MenuItem>
                                    <MenuItem value="Mfa">Mfa</MenuItem>
                                </Select>
                                {errors.bluetoothSpecs?.supportedAccessControlMechanisms && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.bluetoothSpecs?.supportedAccessControlMechanisms}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Supported Versions"}</InputLabel>
                                <Select
                                    label="Supported Versions"
                                    disabled={!canUpdate}
                                    value={formData.bluetoothSpecs.supportedVersions || []}
                                    onChange={(e) => handleSpecChange(e, 'bluetoothSpecs', 'supportedVersions')}
                                    multiple
                                >
                                    <MenuItem value="4.0">v4.0</MenuItem>
                                    <MenuItem value="4.1">v4.1</MenuItem>
                                    <MenuItem value="4.2">v4.2</MenuItem>
                                    <MenuItem value="5.0">v5.0</MenuItem>
                                    <MenuItem value="5.1">v5.1</MenuItem>
                                    <MenuItem value="5.2">v5.2</MenuItem>
                                    <MenuItem value="5.3">v5.3</MenuItem>
                                    <MenuItem value="5.4">v5.4</MenuItem>
                                </Select>
                                {errors.bluetoothSpecs?.supportedVersions && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.bluetoothSpecs?.supportedVersions}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Utilized Version"}</InputLabel>
                                <Select
                                    label="Utilized Version"
                                    disabled={!canUpdate}
                                    value={formData.bluetoothSpecs.utilizedVersion || []}
                                    onChange={(e) => handleSpecChange(e, 'bluetoothSpecs', 'utilizedVersion')}
                                >
                                    {
                                        formData.bluetoothSpecs.supportedVersions?.map((itemData) => (

                                            <MenuItem key={itemData} value={itemData}>{"v" + itemData}</MenuItem>

                                        ))}
                                </Select>
                                {errors.bluetoothSpecs?.utilizedVersion && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.bluetoothSpecs?.utilizedVersion}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </>
                )}
                {formData.supportedCommunicationProtocols?.includes('LoraWan') && (
                    <>
                        <Grid item xs={12}>
                            <Box component={Paper} elevation={2} p={2} style={{ textAlign: 'center', gridColumn: '1 / -1' }} >
                                <Typography variant="h6">{'LoraWan'}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Firmware"
                                    type="text"
                                    disabled={!canUpdate}
                                    value={formData.lorawanSpecs.firmware || ''}
                                    onChange={(e) => handleSpecChange(e, 'lorawanSpecs', 'firmware')}
                                    error={!!errors.lorawanSpecs?.firmware}
                                    helperText={errors.lorawanSpecs?.firmware ?? ''}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="MacAdress"
                                    type="text"
                                    disabled={!canUpdate}
                                    value={formData.lorawanSpecs.macAddress || ''}
                                    onChange={(e) => handleSpecChange(e, 'lorawanSpecs', 'macAddress')}
                                    error={!!errors.lorawanSpecs?.macAddress}
                                    helperText={errors.lorawanSpecs?.macAddress ?? ''}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Firmware Date"
                                        disabled={!canUpdate}
                                        value={formData.lorawanSpecs.firmwareDate || new Date()}
                                        onChange={(date) => handleSpecChange({ target: { value: date } }, 'lorawanSpecs', 'firmwareDate')}
                                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Supported Frequency Bands"}</InputLabel>
                                <Select
                                    label="Supported Frequency Bands"
                                    disabled={!canUpdate}
                                    value={formData.lorawanSpecs.supportedFrequencyBands || []}
                                    onChange={(e) => handleSpecChange(e, 'lorawanSpecs', 'supportedFrequencyBands')}
                                    multiple
                                >
                                    <MenuItem value="EU868">EU868</MenuItem>
                                    <MenuItem value="US915">US915</MenuItem>
                                    <MenuItem value="AS923">AS923</MenuItem>
                                    <MenuItem value="AU915">AU915</MenuItem>
                                    <MenuItem value="CN470">CN470</MenuItem>
                                    <MenuItem value="KR920">KR920</MenuItem>
                                    <MenuItem value="IN865">IN865</MenuItem>
                                    <MenuItem value="RU864">RU864</MenuItem>
                                    <MenuItem value="RU868">RU868</MenuItem>

                                </Select>
                                {errors.lorawanSpecs?.supportedFrequencyBands && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.lorawanSpecs?.supportedFrequencyBands}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Utilized Frequency Bands"}</InputLabel>
                                <Select
                                    label="Utilized Frequency Bands"
                                    disabled={!canUpdate}
                                    value={formData.lorawanSpecs.utilizedFrequencyBand || []}
                                    onChange={(e) => handleSpecChange(e, 'lorawanSpecs', 'utilizedFrequencyBand')}
                                >
                                    {
                                        formData.lorawanSpecs.supportedFrequencyBands?.map((itemData) => (

                                            <MenuItem key={itemData} value={itemData}>{itemData}</MenuItem>

                                        ))}
                                </Select>
                                {errors.lorawanSpecs?.utilizedFrequencyBand && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.lorawanSpecs?.utilizedFrequencyBand}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"JoinMode"}</InputLabel>
                                <Select
                                    label="Join Mode"
                                    disabled={!canUpdate}
                                    value={formData.lorawanSpecs.joinMode || []}
                                    onChange={(e) => handleSpecChange(e, 'lorawanSpecs', 'joinMode')}
                                >
                                    <MenuItem value="ABP">ABP</MenuItem>
                                    <MenuItem value="OTAA">OTAA</MenuItem>
                                </Select>
                                {errors.lorawanSpecs?.supportedStandards && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.lorawanSpecs?.joinMode}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"PhysicalLocation"}</InputLabel>
                                <Select
                                    label="Physical Location"
                                    disabled={!canUpdate}
                                    value={formData.lorawanSpecs.physicalLocation || []}
                                    onChange={(e) => handleSpecChange(e, 'lorawanSpecs', 'physicalLocation')}
                                >
                                    <MenuItem value="OpenSpace">OpenSpace</MenuItem>
                                    <MenuItem value="PrivatePlace">PrivatePlace</MenuItem>
                                    <MenuItem value="SecurePlace">SecurePlace</MenuItem>
                                </Select>
                                {errors.lorawanSpecs?.physicalLocation && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.lorawanSpecs?.physicalLocation}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            inputProps={{'aria-label': 'Adaptive Data Rate'}}
                                            name='lorawanSpecs.adaptiveDataRate'
                                            checked={formData.lorawanSpecs.adaptiveDataRate}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label={'Adaptive Data Rate'}
                                />
                            </FormControl>
                        </Grid>
                    </>
                )}
            </>
        );
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
                                    Devices Details
                                </MDTypography>
                            </MDBox>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}>
                                <form onSubmit={handleUpdate}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="normal">
                                                <TextField
                                                    label="Name"
                                                    disabled={!canUpdate}
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    error={!!errors.name}
                                                    helperText={errors.name ?? ''}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="normal">
                                                <TextField
                                                    label="Serial Number"
                                                    disabled={!canUpdate}
                                                    value={formData.serialNumber}
                                                    error={!!errors.serialNumber}
                                                    helperText={errors.serialNumber ?? ''}
                                                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="normal">
                                                <TextField
                                                    label="Type"
                                                    disabled={!canUpdate}
                                                    value={formData.type}
                                                    error={!!errors.type}
                                                    helperText={errors.type ?? ''}
                                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="normal">
                                                <TextField
                                                    label="DoctorId"
                                                    disabled={!canUpdate}
                                                    value={formData.doctorId}
                                                    error={!!errors.doctorId}
                                                    helperText={errors.doctorId ?? ''}
                                                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>{'Communication Protocol'}</InputLabel>
                                                <Select
                                                    onChange={handleProtocolUtilizedChange}
                                                    disabled={!canUpdate}
                                                    label={'Communication Protocol'}
                                                    value={formData.communicationProtocol}
                                                >
                                                    {
                                                        formData.supportedCommunicationProtocols?.map((itemData) => (

                                                            <MenuItem key={itemData} value={itemData}>{itemData}</MenuItem>

                                                        ))}
                                                </Select>
                                                {errors.communicationProtocol && (
                                                    <FormHelperText sx={{ color: 'red' }}>{errors.communicationProtocol}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="normal">
                                                <TextField
                                                    label="Manufacturer"
                                                    disabled={!canUpdate}
                                                    value={formData.manufacturer}
                                                    error={!!errors.manufacturer}
                                                    helperText={errors.manufacturer ?? ''}
                                                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="normal">
                                                <TextField
                                                    label="Description"
                                                    disabled={!canUpdate}
                                                    value={formData.description}
                                                    error={!!errors.description}
                                                    helperText={errors.description ?? ''}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="normal">
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        label="Manufacturing Date"
                                                        disabled={!canUpdate}
                                                        value={formData.manufacturingDate}
                                                        onChange={handleDateChange}
                                                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="normal">
                                                <TextField
                                                    label="Network Name"
                                                    disabled={!canUpdate}
                                                    value={formData.networkName}
                                                    error={!!errors.networkName}
                                                    helperText={errors.networkName ?? ''}
                                                    onChange={(e) => setFormData({ ...formData, networkName: e.target.value })}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>{'Location'}</InputLabel>
                                                <Select
                                                    label="Location"
                                                    disabled={!canUpdate}
                                                    name='location'
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                >
                                                    <MenuItem value="OpenSpace">OpenSpace</MenuItem>
                                                    <MenuItem value="PrivatePlace">PrivatePlace</MenuItem>
                                                    <MenuItem value="SecurePlace">SecurePlace</MenuItem>
                                                </Select>
                                                {errors.location && (
                                                    <FormHelperText sx={{ color: 'red' }}>{errors.location}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            inputProps={{ 'aria-label': 'Validated' }}
                                                        />
                                                    }
                                                    label={'Validated'}
                                                    disabled={!canUpdate}
                                                    checked={formData.validated}
                                                    onChange={(e) => setFormData({ ...formData, validated: e.target.checked })}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl component="fieldset" fullWidth margin="normal">
                                                <Typography component="legend">Communication Protocols</Typography>
                                                <Box display="flex" flexDirection="row">
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={formData.supportedCommunicationProtocols?.includes('WiFi')}
                                                                disabled={!canUpdate}
                                                                onChange={handleProtocolChange}
                                                                name="WiFi"
                                                            />
                                                        }
                                                        label="WiFi"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={formData.supportedCommunicationProtocols?.includes('Bluetooth')}
                                                                disabled={!canUpdate}
                                                                onChange={handleProtocolChange}
                                                                name="Bluetooth"
                                                            />
                                                        }
                                                        label="Bluetooth"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={formData.supportedCommunicationProtocols?.includes('GSM')}
                                                                disabled={!canUpdate}
                                                                onChange={handleProtocolChange}
                                                                name="GSM"
                                                            />
                                                        }
                                                        label="GSM"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={formData.supportedCommunicationProtocols?.includes('LoraWan')}
                                                                disabled={!canUpdate}
                                                                onChange={handleProtocolChange}
                                                                name="LoraWan"
                                                            />
                                                        }
                                                        label="LoraWan"
                                                    />
                                                    {/* Add more protocols as needed */}
                                                </Box>
                                            </FormControl>
                                        </Grid>
                                        {renderProtocolFields()}
                                        {canUpdate && (
                                            <Grid item xs={12}>
                                                <Button type="submit" variant="outlined" style={{ color: 'black', borderColor: 'black', width: '10%', height: '10px' }} >Update</Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                </form>
                            </MDBox>
                        </Card>
                    </Grid>
                    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                        <Alert onClose={handleCloseSnackbar} severity={snackbarMessageSeverity} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Grid>

            </MDBox>
        </DashboardLayout>
    );


};

export default DeviceDetails;
