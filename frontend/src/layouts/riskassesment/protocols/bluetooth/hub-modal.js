import React, { useEffect, useState } from 'react';
import {
    Button, Select,
    MenuItem, FormControl, InputLabel, TextField,
    Checkbox,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, IconButton, Snackbar, Alert, FormHelperText, Tooltip, Box, Typography
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid'; // Import the v4 function from uuid
import {validateMacAddress} from '../validators-helpers/input-validators'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

import { validateNumberInput } from '../validators-helpers/numbers-validators'

import VersionModal from './version-modal';

const HubModal = ({ open, handleClose, updateHub, hubData, updateAccessPointByUUID }) => {

    const allStandarts = ['4.0', '4.1', '4.2', '5.0', '5.1', '5.2', '5.3', '5.4'];

    const [standardValue, setStandartValue] = useState('');
    const [standarts, setStandartSelections] = useState([]);
    const [defaultStandardIndex, setDefaultStandardIndex] = useState(-1);

    const [activeAccessModalData, setActiveAccessModalData] = useState({});
    const [standartsState, setStandartsState] = useState([]);

    // Validation state section
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const [hub, setHub] = useState({
        gateway_intermediate_device: 'No',
        authentication_method: '',
        secure_communication_channel: '',
        data_integrity: '',
        device_name: '',
        mac_address: '',
        manufacturer: '',
        model: '',
        firmware_updated_year: '',
        antenna_type: '',
        physical_location: '',
        standards: [],
        standardsDataList: [],
        isEditable: false,
        id: ''
    });

    useEffect(() => {
        setHub({
            gateway_intermediate_device: hubData.gateway_intermediate_device ?? 'No',
            authentication_method: hubData.authentication_method ?? '',
            secure_communication_channel: hubData.secure_communication_channel ?? '',
            data_integrity: hubData.data_integrity ?? '',
            device_name: hubData.device_name ?? '',
            mac_address: hubData.mac_address ?? '',
            manufacturer: hubData.manufacturer ?? '',
            model: hubData.model ?? '',
            firmware_updated_year: hubData.firmware_updated_year ?? '',
            antenna_type: hubData.antenna_type ?? '',
            physical_location: hubData.physical_location ?? '',
            standards: hubData.standards ?? [],
            standardsDataList: hubData.standardsDataList ?? [],
            isEditable: hubData.isEditable ?? false,
            id: hubData.id ?? ''
        });

        setStandartsState(allStandarts);

        if (hubData.id &&
            hubData.standardsDataList?.length > 0) {
            hubData.standardsDataList.forEach(standardValue => {

                setStandartsState(prevState => prevState.filter(standard => standard !== standardValue.standar_name));

            });
        }

    }, [open]);

    const updateStandartData = (updatedStandartData) => {

        setHub(prevState => ({
            ...prevState,
            standardsDataList: [...prevState.standardsDataList, updatedStandartData]
        }));
        setStandartSelections([...standarts, standardValue]);

        setStandartsState(prevState => prevState.filter(standard => standard !== updatedStandartData.standar_name.replace('_', '.')));

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHub(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const resetData = () => {
        setHub({});
    };

    const handleDefaultStandardChange = (index) => {
        setHub(prevHub => {
            const updatedStandardsDataList = prevHub.standardsDataList.map((item, i) => ({
                ...item,
                isDefault: i === index
            }));
            return {
                ...prevHub,
                standardsDataList: updatedStandardsDataList
            };
        });
        setDefaultStandardIndex(index);
    };

    const handleModalCancel = () => {
        setErrors({});
        setStandartValue('');
        setStandartSelections([]);
        resetData();
        setDefaultStandardIndex(-1);
        handleClose();
    };

    const [modalOpen, setModalOpen] = useState(false);

    const showModal = () => {
        setActiveAccessModalData({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleModalSave = () => {

        const newErrors = {};
        if (!hub.device_name) newErrors.device_name = 'Device Name is required';
        validateMacAddress(hub.mac_address, 'mac_address' , newErrors)
        if (!hub.manufacturer) newErrors.manufacturer = 'Manufacturer is required';
        if (!hub.model) newErrors.model = 'Model is required';

        validateNumberInput(hub.firmware_updated_year, 'firmware_updated_year', newErrors);

        if (!hub.standardsDataList.length) newErrors.standardsDataList = 'Standards must be populated';
        if (!hub.antenna_type) newErrors.antenna_type = 'Please select an antenna type';
        if (!hub.data_integrity) newErrors.data_integrity = 'Please select a data integrity';
        if (!hub.authentication_method) newErrors.authentication_method = 'Please select an authentication method';
        if (!hub.secure_communication_channel) newErrors.secure_communication_channel = 'Please select a secure communication channel';
        if (!hub.physical_location) newErrors.physical_location = 'Please select a physical location';


        if (Object.keys(newErrors).length > 0) {
            if (newErrors.standardsDataList) {
                setSnackbarMessage(newErrors.standardsDataList);
                setSnackbarOpen(true);
            }
            setErrors(newErrors);
            return;
        }

        const hasDefault = hub.standardsDataList.some(item => item.isDefault);

        if (!hasDefault) {
            setSnackbarMessage('Set default standard');
            setSnackbarOpen(true);
            return;
        }

        if (hub.id) {

            setErrors({});
            updateAccessPointByUUID(hub);
            setStandartSelections([]);
            resetData();
            setDefaultStandardIndex(-1);
            handleClose();
            return;

        }

        setStandartSelections([]);

        hub.id = uuidv4();

        setErrors({});
        updateHub(hub);
        resetData();
        setDefaultStandardIndex(-1);
        handleClose();
    };

    const handleRemoveStandard = (index) => {

        var standartToBeAddedBack = hub.standardsDataList[index];

        setHub((prevHub) => {
            const newStandards = prevHub.standards.filter((_, i) => i !== index);
            const newStandardsDataList = prevHub.standardsDataList.filter((_, i) => i !== index);
            return {
                ...prevHub,
                standards: newStandards,
                standardsDataList: newStandardsDataList
            };
        });

        setStandartsState(prevState => {
            return [...prevState, standartToBeAddedBack.standar_name.replace("_", ".")];
        });
    };

    const renderQuestions = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <Tooltip title="Name assigned to this hub device" arrow>
                            <TextField
                                type="text"
                                label="Device Name"
                                name="device_name"
                                id="15543"
                                value={hub.device_name}
                                error={!!errors.device_name}
                                helperText={errors.device_name ?? ''}
                                onChange={handleInputChange}
                            />
                        </Tooltip>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <Tooltip title="Enter the MAC address for this hub device" arrow>
                            <TextField
                                type="text"
                                label="MAC Address"
                                name="mac_address"
                                id="1"
                                value={hub.mac_address}
                                error={!!errors.mac_address}
                                helperText={errors.mac_address ?? ''}
                                onChange={handleInputChange}
                            />
                        </Tooltip>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <Tooltip title="Specify the manufacturer of this hub device" arrow>
                            <TextField
                                type="text"
                                label="Manufacturer"
                                name="manufacturer"
                                value={hub.manufacturer}
                                error={!!errors.manufacturer}
                                helperText={errors.manufacturer ?? ''}
                                id="4"
                                onChange={handleInputChange}
                            />
                        </Tooltip>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <Tooltip title="Specify the model name or number of the hub device" arrow>
                            <TextField
                                type="text"
                                label="Model"
                                name="model"
                                value={hub.model}
                                error={!!errors.model}
                                helperText={errors.model ?? ''}
                                id="5"
                                onChange={handleInputChange}
                            />
                        </Tooltip>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <Tooltip title="Specify the year when the firmware was last updated" arrow>
                            <TextField
                                type="number"
                                label="Firmware Updated Year"
                                name="firmware_updated_year"
                                value={hub.firmware_updated_year}
                                error={!!errors.firmware_updated_year}
                                helperText={errors.firmware_updated_year ?? ''}
                                id="6"
                                onChange={handleInputChange}
                            />
                        </Tooltip>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                            <InputLabel>{'Antenna Type'}</InputLabel>
                            <Select
                                label={'Antenna Type'}
                                name="antenna_type"
                                value={hub.antenna_type}
                                error={!!errors.antenna_type}
                                onChange={(e) => handleInputChange(e)}
                                id="7"
                            >
                                <MenuItem key={'chip'} value={'chip'}>{'Chip'}</MenuItem>
                                <MenuItem key={'pcbTrace'} value={'pcbTrace'}>{'PCB Trace'}</MenuItem>
                                <MenuItem key={'dipole'} value={'dipole'}>{'Dipole'}</MenuItem>
                                <MenuItem key={'helical'} value={'helical'}>{'Helical'}</MenuItem>
                                <MenuItem key={'patch'} value={'patch'}>{'Patch'}</MenuItem>
                                <MenuItem key={'whip'} value={'whip'}>{'Whip'}</MenuItem>
                            </Select>
                            {errors.antenna_type && (
                                <FormHelperText sx={{ color: 'red' }}>{errors.antenna_type}</FormHelperText>
                            )}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>{'Authentication Method'}</InputLabel>
                        <Select
                            label={'Authentication Method'}
                            name="authentication_method"
                            value={hub.authentication_method}
                            error={!!errors.authentication_method}
                            onChange={(e) => handleInputChange(e)}
                            id="7324"
                        >
                            <MenuItem key={'none'} value={'none'}>{'None'}</MenuItem>
                            <MenuItem key={'passkey'} value={'passkey'}>{'Passkey'}</MenuItem>
                            <MenuItem key={'numericComparison'} value={'numericComparison'}>{'Numeric Comparison'}</MenuItem>
                            <MenuItem key={'outofBand'} value={'outofBand'}>{'Out-of-Band'}</MenuItem>
                            <MenuItem key={'secureSimplePairing'} value={'secureSimplePairing'}>{'Secure Simple Pairing'}</MenuItem>
                        </Select>
                        {errors.authentication_method && (
                            <FormHelperText sx={{ color: 'red' }}>{errors.authentication_method}</FormHelperText>
                        )}

                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>{'Data Integrity'}</InputLabel>
                        <Select
                            label={'Data Integrity'}
                            name="data_integrity"
                            value={hub.data_integrity}
                            error={!!errors.data_integrity}
                            onChange={(e) => handleInputChange(e)}
                            id="27324"
                        >
                            <MenuItem key={'none'} value={'none'}>{'None'}</MenuItem>
                            <MenuItem key={'CRC'} value={'CRC'}>{'Cyclic Redundancy Check (CRC)'}</MenuItem>
                            <MenuItem key={'MAC'} value={'MAC'}>{'Message Authentication Code (MAC)'}</MenuItem>
                        </Select>
                        {errors.data_integrity && (
                            <FormHelperText sx={{ color: 'red' }}>{errors.data_integrity}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>{'Secure Communication Channel'}</InputLabel>
                        <Select
                            label={'Secure Communication Channel'}
                            name="secure_communication_channel"
                            value={hub.secure_communication_channel}
                            error={!!errors.secure_communication_channel}
                            onChange={(e) => handleInputChange(e)}
                            id="27324"
                        >
                            <MenuItem key={'none'} value={'none'}>{'None'}</MenuItem>
                            <MenuItem key={'TLS'} value={'TLS'}>{'Transport Layer Security (TLS)'}</MenuItem>
                            <MenuItem key={'Dtls'} value={'Dtls'}>{'Datagram Transport Layer Security (DTLS)'}</MenuItem>
                        </Select>
                        {errors.secure_communication_channel && (
                            <FormHelperText sx={{ color: 'red' }}>{errors.secure_communication_channel}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>{'Physical Location'}</InputLabel>
                        <Select
                            label={'Physical Location'}
                            name="physical_location"
                            error={!!errors.physical_location}
                            value={hub.physical_location}
                            onChange={(e) => handleInputChange(e)}
                            id="7"
                        >
                            <MenuItem key={'securePlace'} value={'securePlace'}>{'Secure Place'}</MenuItem>
                            <MenuItem key={'openSpace'} value={'openSpace'}>{'Open Space'}</MenuItem>
                            <MenuItem key={'privatePlace'} value={'privatePlace'}>{'Private Place'}</MenuItem>
                        </Select>
                        {errors.physical_location && (
                            <FormHelperText sx={{ color: 'red' }}>{errors.physical_location}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Button
                        variant="outlined"
                        onClick={() => showModal()}
                        style={{ color: 'black', borderColor: 'black', width: '100%', height: '56px' }}>
                        {'Add Standard Version'}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>

                    {hub.standardsDataList?.map((itemData, index) => (
                        <Grid item container alignItems="center" key={index}>
                            <Grid item xs={12} sm={6}>
                                <Box display="flex" alignItems="center">
                                    {/* Checkbox without label */}
                                    <Checkbox
                                        checked={itemData.isDefault}
                                        onChange={() => handleDefaultStandardChange(index)}
                                    />

                                    {/* Label as Typography, to prevent Checkbox from triggering */}
                                    <Typography
                                        // onClick={() => handleOnClickStandard(itemData)} // Replace with desired action
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {itemData.standar_name}
                                    </Typography>

                                    {/* Close Icon for delete, positioned right next to the label */}
                                    <IconButton onClick={() => handleRemoveStandard(index)} size="small">
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Grid>

                            {/* Display success icon if the item is implemented */}
                            <Grid item>
                                {itemData.isImplemented && <CheckCircleIcon color="success" />}
                            </Grid>
                        </Grid>
                    ))}
                    {hub.standardsDataList?.length > 0 && !hub.standardsDataList.some(item => item.isDefault) && (
                        <Box display="flex" alignItems="center" mt={2}>
                            <InfoIcon color="primary" style={{ marginRight: '8px' }} />
                            <Typography variant="body2" color="textSecondary">
                                Check the utilized standard.
                            </Typography>
                        </Box>
                    )}
                </Grid>
                <VersionModal open={modalOpen} handleClose={closeModal} updateStandartData={updateStandartData} standards={standartsState} activeAccessModalData={activeAccessModalData} />
            </Grid>
        )
    };

    return (
        <Dialog open={open} onClose={() => handleModalCancel()}>
            <DialogTitle>Add Hub</DialogTitle>
            <DialogContent>
                {renderQuestions()}
            </DialogContent>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <DialogActions>
                <Button onClick={() => handleModalCancel()}>Cancel</Button>
                <Button onClick={() => handleModalSave()}>Save</Button>
            </DialogActions>
        </Dialog>
    );

};


export default HubModal;
