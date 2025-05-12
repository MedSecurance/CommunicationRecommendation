import React, { useEffect, useState } from 'react';
import {
    Button,
    FormControl, TextField,
    Checkbox,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, IconButton, Snackbar, Alert, FormHelperText, Box ,Typography
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid'; // Import the v4 function from uuid


import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import AddStandardModal from './add-standard-modal';

const GsmNodeModal = ({ open, handleClose, updateHub, hubData, updateAccessPointByUUID }) => {

    const allStandarts = ['3G', '4G', '5G'];

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

    const handleStandartInputChange = (e) => {
        const { name, value } = e.target;
        setHub(prevState => ({
            ...prevState,
            standards: [...prevState.standards, value]
        }));
        setStandartValue(value);
    };

    const [modalOpen, setModalOpen] = useState(false);

    const showModal = () => {
        setActiveAccessModalData({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
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
                <Grid item xs={12} sm={12}>
                    <Button
                        variant="outlined"
                        onClick={() => showModal()}
                        style={{ color: 'black', borderColor: 'black', width: '100%', height: '56px' }}>
                        {'Add Version'}
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
                <AddStandardModal open={modalOpen} handleClose={closeModal} updateStandartData={updateStandartData} standards={standartsState} activeAccessModalData={activeAccessModalData} />
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


export default GsmNodeModal;
