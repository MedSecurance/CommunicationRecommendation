import React, { useState, useContext, useEffect } from 'react';
import {
    Grid, Button, TextField, FormControl, Dialog, DialogContent, DialogTitle, InputLabel, 
    Select, MenuItem, DialogActions, FormControlLabel, Checkbox, Box, Typography, Paper, FormHelperText, Tooltip
} from '@mui/material';
import { AddDevice } from "services/device-manager-service";
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthContext } from '../../../../auth/AuthContext';
import { ValidateFromData, SetProtocolsData } from '../helpers/validations'
import { standardsUtilizedItems, encryptionItems } from '../helpers/data-helper';

import {deviceManagerToolTips} from '../../tooltips'

const CreateDeviceDialog = ({ open, handleClose }) => {

    const { getAuthHeaders } = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [frequenciesToSelect, setFrequenciesToSelect] = useState([]);
    const [encryptionToSelect, setEncryptionToSelect] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        serialNumber: '',
        type: '',
        manufacturer: '',
        description: '',
        manufacturingDate: new Date(),
        communicationProtocol: '',
        networkName: '',
        networkIdentifier: '',
        doctorId: '',
        location: '',
        batteryStatus: 0,
        validated: false,
        standardCompliance: false,
        supportedCommunicationProtocols: [],
        wifiSpecs: {
            ipAddress: "",
            macAddress: "",
            encryption: "",
            bandwidth: 0,
            firmware: "",
            firmwareDate: new Date(),
            supportedStandards: [],
            supportedFrequencies: [],
            standardUtilized: "",
            frequencyUtilized: "",
        },
        gsmSpecs: {
            bandwidth: 0,
            macAddress: "",
            firmware: "",
            firmwareDate: new Date(),
            supportedGenerations: [],
            utilizedGeneration: "",
        },
        bluetoothSpecs: {
            bandwidth: 0,
            firmware: "",
            macAddress: "",
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
        }
    });

    useEffect(() => {
        setErrors({});
        setFormData({
            name: '',
            serialNumber: '',
            type: '',
            manufacturer: '',
            macaddress: '',
            description: '',
            manufacturingDate: new Date(),
            communicationProtocol: '',
            networkName: '',
            networkIdentifier: '',
            doctorId: '',
            location: '',
            batteryStatus: 0,
            validated: false,
            standardCompliance: false,
            supportedCommunicationProtocols: [],
            wifiSpecs: {
                ipAddress: "",
                macAddress: "",
                encryption: "",
                bandwidth: 0,
                firmware: "",
                firmwareDate: new Date(),
                supportedStandards: [],
                supportedFrequencies: [],
                standardUtilized: "",
                frequencyUtilized: "",
            },
            gsmSpecs: {
                bandwidth: 0,
                macAddress: "",
                firmware: "",
                firmwareDate: new Date(),
                supportedGenerations: [],
                utilizedGeneration: "",
            },
            bluetoothSpecs: {
                bandwidth: 0,
                firmware: "",
                macAddress: "",
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
            }
        });

    }, [open]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {

            const newErrors = ValidateFromData(formData);

            setErrors(newErrors);

            if (Object.keys(newErrors).length > 0) {
                return;
            }

            SetProtocolsData(formData);

            await AddDevice(formData, getAuthHeaders);
            setFormData({});
            handleClose();
        } catch (error) {
            console.error('Error creating data:', error);
        }
    };

    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };

    const handleProtocolUtilizedChange = (e) => {
        const protocol = e.target.value;
        setFormData({ ...formData, communicationProtocol: protocol });
    };

    const handleProtocolChange = (e) => {
        const protocol = e.target.name;
        setFormData((prevState) => {
            const newProtocols = prevState.supportedCommunicationProtocols.includes(protocol)
                ? prevState.supportedCommunicationProtocols.filter(p => p !== protocol)
                : [...prevState.supportedCommunicationProtocols, protocol];
            return { ...prevState, supportedCommunicationProtocols: newProtocols };
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

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

    const handleBluetoothVersionsSelector = (e, specKey, field) => {
        debugger;
        const value = e.target.value;
        
        setFormData({
            ...formData,
            [specKey]: {
                ...formData[specKey],
                [field]: Array.isArray(value) ? value : e.target.value,
                ["utilizedVersion"] : ""
            }
        });
   
    };


    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const handleUtilizedStandardChange = (e, specKey, field) => {

        const value = e.target.value;
        debugger;

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

    const handleUtilizedFregChange = (e, specKey, field) => {

        const value = e.target.value;
        debugger;

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
                                    label="Bandwidth"
                                    type="number"
                                    value={formData.wifiSpecs.bandwidth || ''}
                                    onChange={(e) => handleSpecChange(e, 'wifiSpecs', 'bandwidth')}
                                    error={!!errors.wifiSpecs?.bandwidth}
                                    helperText={errors.wifiSpecs?.bandwidth ?? ''}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Ip Adress"
                                    type="text"
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
                                        value={formData.wifiSpecs.firmwareDate || new Date()}
                                        onChange={(date) => handleSpecChange({ target: { value: date } }, 'wifiSpecs', 'firmwareDate')}
                                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{"Supported Standards"}</InputLabel>
                                <Select
                                    label="Supported Standards"
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
                                    value={formData.wifiSpecs.standardUtilized || []}
                                    onChange={(e) => handleUtilizedStandardChange(e, 'wifiSpecs', 'standardUtilized')}
                                >
                                    <MenuItem value="_802_11a">802.11a</MenuItem>
                                    <MenuItem value="_802_11b">802.11b</MenuItem>
                                    <MenuItem value="_802_11g">802.11g</MenuItem>
                                    <MenuItem value="_802_11n">802.11n</MenuItem>
                                    <MenuItem value="_802_11ac">802.11ac</MenuItem>
                                    <MenuItem value="_802_11ax">802.11ax</MenuItem>
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

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{'Encryption'}</InputLabel>
                                <Select
                                    label="Encryption"
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
                                    label="Bandwidth"
                                    type="number"
                                    value={formData.gsmSpecs.bandwidth || ''}
                                    onChange={(e) => handleSpecChange(e, 'gsmSpecs', 'bandwidth')}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Firmware"
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
                                    label="Bandwidth"
                                    type="number"
                                    value={formData.bluetoothSpecs.bandwidth || ''}
                                    onChange={(e) => handleSpecChange(e, 'bluetoothSpecs', 'bandwidth')}
                                    error={!!errors.bluetoothSpecs?.bandwidth}
                                    helperText={errors.bluetoothSpecs?.bandwidth ?? ''}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Firmware"
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
                                    value={formData.bluetoothSpecs.supportedVersions || []}
                                    onChange={(e) => handleBluetoothVersionsSelector(e, 'bluetoothSpecs', 'supportedVersions')}
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
                                    value={formData.bluetoothSpecs.utilizedVersion || []}
                                    onChange={(e) => handleSpecChange(e, 'bluetoothSpecs', 'utilizedVersion')}
                                >
                                        {
                                        formData.bluetoothSpecs.supportedVersions?.map((itemData) => (

                                            <MenuItem value={itemData}>{"v"+itemData}</MenuItem>

                                        ))}   
                                </Select>
                                {errors.bluetoothSpecs?.utilizedVersion && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.bluetoothSpecs?.utilizedVersion}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </>
                )}
            </>
        );
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Create New Device</DialogTitle>
            <DialogContent>
                <form onSubmit={handleCreate}>
                    <Grid container spacing={2}>
                    <Tooltip title={deviceManagerToolTips.DeviceName}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                error={!!errors.name}
                                helperText={errors.name ?? ''}
                            />
                        </Grid>
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.DeviceSerialNumber}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Serial Number"
                                name="serialNumber"
                                value={formData.serialNumber}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                error={!!errors.serialNumber}
                                helperText={errors.serialNumber ?? ''}
                            />
                        </Grid>
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.DeviceType ?? ""}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Type</InputLabel>
                                <Select
                                    label="Type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="Sensor">Sensor</MenuItem>
                                    <MenuItem value="Actuator">Actuator</MenuItem>
                                    <MenuItem value="Collector">Collector</MenuItem>
                                </Select>
                                {errors.type && (
                                    <FormHelperText sx={{ color: 'red' }}>{errors.type}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.Manufacture ?? ""}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Manufacturer"
                                name="manufacturer"
                                value={formData.manufacturer}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                error={!!errors.manufacturer}
                                helperText={errors.manufacturer ?? ''}
                            />
                        </Grid>
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.Description ?? ""}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                error={!!errors.description}
                                helperText={errors.description ?? ''}
                            />
                        </Grid>
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.ManufactureDate ?? ""}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Manufacturing Date"
                                        value={formData.manufacturingDate}
                                        onChange={(date) => handleDateChange(date, 'manufacturingDate')}
                                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.NetworkName ?? ""}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Network Name"
                                name="networkName"
                                value={formData.networkName}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                error={!!errors.networkName}
                                helperText={errors.networkName ?? ''}
                            />
                        </Grid>
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.NetworkIdentifier ?? ""}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Network Identifier"
                                name="networkIdentifier"
                                value={formData.networkIdentifier}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                error={!!errors.networkIdentifier}
                                helperText={errors.networkIdentifier ?? ''}
                            />
                        </Grid>
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.DoctorId ?? ""}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Doctor ID"
                                name="doctorId"
                                value={formData.doctorId}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                error={!!errors.doctorId}
                                helperText={errors.doctorId ?? ''}
                            />
                        </Grid>
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.BatteryStatus ?? ""}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Battery Status"
                                type="number"
                                name="batteryStatus"
                                value={formData.batteryStatus}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.Location ?? ""}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{'Location'}</InputLabel>
                                <Select
                                    label="Location"
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
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.Validated ?? ""}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            inputProps={{ 'aria-label': 'Hidden ssid' }}
                                            name='validated'
                                            checked={formData.validated}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label={'Validated'}
                                />
                            </FormControl>
                        </Grid>
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.StandardCompliance ?? ""}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            inputProps={{ 'aria-label': 'Hidden ssid' }}
                                            name='standardCompliance'
                                            checked={formData.standardCompliance}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label={'Standard Compliance'}
                                />
                            </FormControl>
                        </Grid>
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.CommunicationProtocol ?? ""}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>{'Communication Protocol'}</InputLabel>
                                <Select
                                    onChange={handleProtocolUtilizedChange}
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
                        </Tooltip>
                        <Tooltip title={deviceManagerToolTips.CommunicationProtocolCheckboxes ?? ""}>
                        <Grid item xs={12} sm={6}>
                            <FormControl component="fieldset" fullWidth margin="normal">
                                <Typography component="legend">Communication Protocols</Typography>
                                <Box display="flex" flexDirection="row">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.supportedCommunicationProtocols?.includes('WiFi')}
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
                                                onChange={handleProtocolChange}
                                                name="GSM"
                                            />
                                        }
                                        label="GSM"
                                    />
                                    {/* Add more protocols as needed */}
                                </Box>
                            </FormControl>
                        </Grid>
                        </Tooltip>
                        {renderProtocolFields()}
                    </Grid>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateDeviceDialog;
