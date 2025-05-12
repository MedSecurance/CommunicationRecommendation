import React, { useEffect, useState } from 'react';
import {
    Button, Select,
    MenuItem, FormControl, InputLabel, TextField,
    Checkbox, FormControlLabel,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, IconButton, Snackbar, Alert, FormHelperText, Box, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid'; // Import the v4 function from uuid

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

import FrequencyBandModal from './frequency-band-modal';


const GateWayModal = ({ open, handleClose, updateHub, hubData, updateAccessPointByUUID }) => {

    const allStandarts = ['EU868', 'US915', 'AS923', 'AU915', 'CN470', 'KR920'];

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
        gateway_backbone_connection_type: '',
        bandwidth_in_Mbps: '',
        adaptive_data_rate: false,
        gateway_name: '',
        manufacturer: '',
        model: '',
        firmware_updated_year: '',
        physical_location: '',
        standards: [],
        standardsDataList: [],
        isEditable: false,
        id: ''
    });

    useEffect(() => {
        if (hubData) {
            setHub({
                gateway_backbone_connection_type: hubData.gateway_backbone_connection_type ?? '',
                bandwidth_in_Mbps: hubData.bandwidth_in_Mbps ?? '',
                adaptive_data_rate: hubData.adaptive_data_rate ?? false,
                gateway_name: hubData.gateway_name ?? '',
                manufacturer: hubData.manufacturer ?? '',
                model: hubData.model ?? '',
                firmware_updated_year: hubData.firmware_updated_year ?? '',
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
        }
    }, [hubData]);

    const updateStandartData = (updatedStandartData) => {

        setHub(prevState => ({
            ...prevState,
            standardsDataList: [...prevState.standardsDataList, updatedStandartData]
        }));
        setStandartSelections([...standarts, standardValue]);

        setStandartsState(prevState => prevState.filter(standard => standard !== updatedStandartData.standar_name));

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHub(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const resetData = () => {
        setHub({
            gateway_backbone_connection_type: '',
            bandwidth_in_Mbps: '',
            adaptive_data_rate: false,
            gateway_name: '',
            manufacturer: '',
            model: '',
            firmware_updated_year: '',
            physical_location: '',
            standards: [],
            standardsDataList: [],
            isEditable: false,
            id: ''

        });
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
        if (!hub.gateway_backbone_connection_type) newErrors.gateway_backbone_connection_type = 'Gateway backbone connection type is required';
        if (!hub.bandwidth_in_Mbps) newErrors.bandwidth_in_Mbps = 'Bandwidth is required';
        if (!hub.gateway_name) newErrors.gateway_name = 'Gateway name is required';
        if (!hub.model) newErrors.model = 'Model is required';
        if (!hub.manufacturer) newErrors.manufacturer = 'Manufacturer is required';
        if (!hub.firmware_updated_year) newErrors.firmware_updated_year = 'Firmware Updated Year is required';
        if (!hub.standardsDataList.length) newErrors.standardsDataList = 'Frequency Bands must be populated';
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

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setHub(prevState => ({
            ...prevState,
            [name]: checked,
        }));
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
            return [...prevState, standartToBeAddedBack.standar_name];
        });
    };

    const renderQuestions = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            type='text'
                            label='Gateway Name'
                            name='gateway_name'
                            id='15543'
                            value={hub.gateway_name}
                            onChange={handleInputChange}
                            error={!!errors.gateway_name}
                            helperText={errors.gateway_name ?? ''}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            type='text'
                            label='Manufacturer'
                            name='manufacturer'
                            value={hub.manufacturer}
                            id='4'
                            onChange={handleInputChange}
                            error={!!errors.manufacturer}
                            helperText={errors.manufacturer ?? ''}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            type='text'
                            label='Model'
                            name='model'
                            value={hub.model}
                            id='5'
                            onChange={handleInputChange}
                            error={!!errors.model}
                            helperText={errors.model ?? ''}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>{'Gateway Backbone Connection Type'}</InputLabel>
                        <Select
                            label={'Gateway Backbone Connection Type'}
                            name='gateway_backbone_connection_type'
                            value={hub.gateway_backbone_connection_type}
                            onChange={(e) => handleInputChange(e)}
                            id='7'
                        >
                            <MenuItem key={'GSM'} value={'GSM'}>{'GSM'}</MenuItem>
                            <MenuItem key={'WiFi'} value={'WiFi'}>{'WiFi'}</MenuItem>
                            <MenuItem key={'Cable'} value={'Cable'}>{'Cable'}</MenuItem>
                        </Select>
                        {errors.gateway_backbone_connection_type && (
                            <FormHelperText sx={{ color: 'red' }}>{errors.gateway_backbone_connection_type}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            type='number'
                            label='Firmware updated year'
                            name='firmware_updated_year'
                            value={hub.firmware_updated_year}
                            id='6'
                            onChange={handleInputChange}
                            error={!!errors.firmware_updated_year}
                            helperText={errors.firmware_updated_year ?? ''}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>{'Physical location'}</InputLabel>
                        <Select
                            label={'Physical location'}
                            name='physical_location'
                            value={hub.physical_location}
                            onChange={(e) => handleInputChange(e)}
                            id='7'
                        >
                            <MenuItem key={'securePlace'} value={'securePlace'}>{'secure place'}</MenuItem>
                            <MenuItem key={'openSpace'} value={'openSpace'}>{'open space'}</MenuItem>
                            <MenuItem key={'privatePlace'} value={'privatePlace'}>{'private place'}</MenuItem>
                        </Select>
                        {errors.physical_location && (
                            <FormHelperText sx={{ color: 'red' }}>{errors.physical_location}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    inputProps={{ 'aria-label': 'Adaptive Data Rate' }}
                                    name='adaptive_data_rate'
                                    checked={hub.adaptive_data_rate}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label={'Adaptive Data Rate'}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            type='number'
                            label='Bandwidth In Mbps'
                            name='bandwidth_in_Mbps'
                            value={hub.bandwidth_in_Mbps}
                            id='6'
                            onChange={handleInputChange}
                            error={!!errors.bandwidth_in_Mbps}
                            helperText={errors.bandwidth_in_Mbps ?? ''}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Button
                        variant="outlined"
                        onClick={() => showModal()}
                        style={{ color: 'black', borderColor: 'black', width: '100%', height: '56px' }}>
                        {'Add Frequency Band'}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    {hub.standardsDataList.map((itemData, index) => (
                        <Grid container alignItems="center" key={index}>
                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={itemData.isDefault}
                                            onChange={() => handleDefaultStandardChange(index)}
                                        />
                                    }
                                    label={itemData.standar_name}
                                />
                            </Grid>
                            <Grid item>
                                {itemData.isImplemented && <CheckCircleIcon color="success" />}
                            </Grid>
                            <Grid item>
                                <IconButton onClick={() => handleRemoveStandard(index)}>
                                    <DeleteIcon />
                                </IconButton>
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
                <FrequencyBandModal open={modalOpen} handleClose={closeModal} updateStandartData={updateStandartData} standards={standartsState} activeAccessModalData={activeAccessModalData} />
            </Grid>
        )
    };

    return (
        <Dialog open={open} onClose={() => handleModalCancel()}>
            <DialogTitle>Add Gateway</DialogTitle>
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


export default GateWayModal;
