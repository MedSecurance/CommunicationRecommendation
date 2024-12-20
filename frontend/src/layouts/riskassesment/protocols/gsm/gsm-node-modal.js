import React, { useEffect, useState } from 'react';
import {
    Button, Select,
    MenuItem, FormControl, InputLabel, TextField,
    Checkbox, FormControlLabel,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, IconButton, Snackbar, Alert, FormHelperText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid'; // Import the v4 function from uuid


import { ThreeG, FourG, FiveG } from './standarts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const GsmNodeModal = ({ open, handleClose, updateHub, hubData, updateAccessPointByUUID }) => {

    const [standardValue, setStandartValue] = useState('');
    const [standarts, setStandartSelections] = useState([]);
    const [defaultStandardIndex, setDefaultStandardIndex] = useState(-1);

    // Validation state section
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const [hub, setHub] = useState({
        device_name: '',
        mac_address: '',
        manufacturer: '',
        log_monitoring_enabled: false,
        model: '',
        firmware_updated_year: '',
        isp_provider: '',
        physical_location: '',
        standards: [],
        standardsDataList: [],
        isEditable: false,
        id: ''
    });

    useEffect(() => {
        setHub({
            device_name: hubData.device_name ?? '',
            mac_address: hubData.mac_address ?? '',
            manufacturer: hubData.manufacturer ?? '',
            log_monitoring_enabled: hubData.log_monitoring_enabled ?? false,
            model: hubData.model ?? '',
            firmware_updated_year: hubData.firmware_updated_year ?? '',
            isp_provider: hubData.isp_provider ?? '',
            physical_location: hubData.physical_location ?? '',
            standards: hubData.standards ?? [],
            standardsDataList: hubData.standardsDataList ?? [],
            isEditable: hubData.isEditable ?? false,
            id: hubData.id ?? ''
        });
    }, [open]);

    const updateStandartData = (updatedStandartData) => {
        setHub(prevState => ({
            ...prevState,
            standardsDataList: [...prevState.standardsDataList, updatedStandartData]
        }));
        setStandartSelections([...standarts, standardValue]);
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

    const handleStandartInputChange = (e) => {
        const { name, value } = e.target;
        setHub(prevState => ({
            ...prevState,
            standards: [...prevState.standards, value]
        }));
        setStandartValue(value);
    };

    const handleModalCancel = () => {
        setErrors({});
        setStandartValue('');
        setStandartSelections([]);
        resetData();
        setDefaultStandardIndex(-1);
        handleClose();
    };

    const handleModalSave = () => {

        const newErrors = {};
        if (!hub.device_name) newErrors.device_name = 'Device Name is required';
        if (!hub.manufacturer) newErrors.manufacturer = 'Manufacturer is required';
        if (!hub.model) newErrors.model = 'Model is required';
        if (!hub.firmware_updated_year) newErrors.firmware_updated_year = 'Firmware Updated Year is required';
        if (!hub.standardsDataList.length) newErrors.standardsDataList = 'Standards must be populated';


        if (Object.keys(newErrors).length > 0) {
            if (newErrors.standardsDataList) {
                setSnackbarMessage(newErrors.standardsDataList);
                setSnackbarOpen(true);
            }
            setErrors(newErrors);
            return;
        }

        if (defaultStandardIndex < 0) {
            setSnackbarMessage('Set default standard');
            setSnackbarOpen(true);
            return;
        }

        if (hub.id) {

            var defaultStandart = hub.standardsDataList[defaultStandardIndex];

            if (defaultStandart)
                defaultStandart.isDefault = true;

            setErrors({});
            updateAccessPointByUUID(hub);
            setStandartSelections([]);
            resetData();
            setDefaultStandardIndex(-1);
            handleClose();
            return;

        }

        setStandartSelections([]);

        var defaultStandart = hub.standardsDataList[defaultStandardIndex];
        defaultStandart.isDefault = true;

        hub.id = uuidv4();

        setErrors({});
        updateHub(hub);
        resetData();
        setDefaultStandardIndex(-1);
        handleClose();
    };

    const handleRemoveStandard = (index) => {
        setHub((prevHub) => {
            const newStandards = prevHub.standards.filter((_, i) => i !== index);
            const newStandardsDataList = prevHub.standardsDataList.filter((_, i) => i !== index);
            return {
                ...prevHub,
                standards: newStandards,
                standardsDataList: newStandardsDataList
            };
        });
    };

    const renderQuestions = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            type='text'
                            label='Device Name'
                            name='device_name'
                            id='15543'
                            value={hub.device_name}
                            error={!!errors.device_name}
                            helperText={errors.device_name ?? ''}
                            onChange={handleInputChange}
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
                            error={!!errors.manufacturer}
                            helperText={errors.manufacturer ?? ''}
                            id='4'
                            onChange={handleInputChange}
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
                            error={!!errors.model}
                            helperText={errors.model ?? ''}
                            id='5'
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            type='number'
                            label='Firmware updated year'
                            name='firmware_updated_year'
                            value={hub.firmware_updated_year}
                            error={!!errors.firmware_updated_year}
                            helperText={errors.firmware_updated_year ?? ''}
                            id='6'
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>{'Standard'}</InputLabel>
                        <Select
                            label={'Standart'}
                            name='standard'
                            onChange={(e) => handleStandartInputChange(e)}
                            id='5'
                        >
                            <MenuItem key={'3g'} value={'3g'}>{'3G'}</MenuItem>
                            <MenuItem key={'4g'} value={'4g'}>{'4G'}</MenuItem>
                            <MenuItem key={'5g'} value={'5g'}>{'5G'}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    {hub.standardsDataList?.map((itemData, index) => (
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
                </Grid>
            </Grid>
        )
    };

    const renderStandartChoice = () => {
        switch (standardValue) {
            case '3g':
                return (<ThreeG updateStandartData={updateStandartData} setStandartValue={setStandartValue} />)
            case '4g':
                return (<FourG updateStandartData={updateStandartData} setStandartValue={setStandartValue} />)
            case '5g':
                return (<FiveG updateStandartData={updateStandartData} setStandartValue={setStandartValue} />)
            default:
                return (''
                );
        }
    };

    return (
        <Dialog open={open} onClose={() => handleModalCancel()}>
            <DialogTitle>Add Hub</DialogTitle>
            <DialogContent>
                {renderQuestions()}
                {renderStandartChoice()}
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


export default GsmNodeModal;
