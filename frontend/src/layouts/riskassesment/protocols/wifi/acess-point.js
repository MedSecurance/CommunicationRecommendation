import React, { useState, useEffect } from 'react';
import {
    Button, Select,
    MenuItem, FormControl, InputLabel, TextField,
    Checkbox, FormControlLabel,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, IconButton, Snackbar, Alert, FormHelperText, Box, Typography, Tooltip
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

import { v4 as uuidv4 } from 'uuid';

import StandardModal from './standart-modal';

import { validateNumberInput } from '../validators-helpers/numbers-validators'

const AcessPointModal = ({ open, handleClose, updateAcessPoints, acessPointsData, updateAccessPointByUUID }) => {

    const [standardValue, setStandartValue] = useState('');
    const [activeAccessModalData, setActiveAccessModalData] = useState({});

    const [standarts, setStandartSelections] = useState([]);
    const [standartsState, setStandartsState] = useState([]);
    const [defaultStandardIndex, setDefaultStandardIndex] = useState(-1);

    const allStandarts = ['802.11a', '802.11b', '802.11g', '802.11n', '802.11ac', '802.11ax'];

    // Validation state section
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };


    const [accessPoint, setAccessPoint] = useState({
        access_point_name: '',
        ssid: '',
        hidden_ssid: false,
        manufacturer: '',
        model: '',
        firmware_updated_year: '',
        antenna_type: '',
        physical_location: '',
        standards: [],
        standardsDataList: [],
        id: ''
    });

    useEffect(() => {
        setAccessPoint({
            access_point_name: acessPointsData.access_point_name ?? '',
            ssid: acessPointsData.ssid ?? '',
            hidden_ssid: acessPointsData.hidden_ssid ?? false,
            manufacturer: acessPointsData.manufacturer ?? '',
            model: acessPointsData.model ?? '',
            firmware_updated_year: acessPointsData.firmware_updated_year ?? '',
            antenna_type: acessPointsData.antenna_type ?? '',
            physical_location: acessPointsData.physical_location ?? '',
            standards: acessPointsData.standards ?? [],
            standardsDataList: acessPointsData.standardsDataList ?? [],
            id: acessPointsData.id ?? ''
        });

        setStandartsState(allStandarts);

        if (acessPointsData.id &&
            acessPointsData.standardsDataList?.length > 0) {
            acessPointsData.standardsDataList.forEach(standardValue => {

                setStandartsState(prevState => prevState.filter(standard => standard !== standardValue.standar_name.replace('_', '.')));

            });
        }

    }, [open]);

    const updateStandartData = (updatedStandartData) => {

        setAccessPoint(prevState => ({
            ...prevState,
            standardsDataList: [...prevState.standardsDataList, updatedStandartData]
        }));

        setStandartSelections([...standarts, updatedStandartData.standar_name.replace('_', '.')]);

        setStandartsState(prevState => prevState.filter(standard => standard !== updatedStandartData.standar_name.replace('_', '.')));

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccessPoint(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRemoveStandard = (index) => {

        var standartToBeAddedBack = accessPoint.standardsDataList[index];

        setAccessPoint((prevAccesspoint) => {
            const newStandards = prevAccesspoint.standards.filter((_, i) => i !== index);
            const newStandardsDataList = prevAccesspoint.standardsDataList.filter((_, i) => i !== index);

            return {
                ...prevAccesspoint,
                standards: newStandards,
                standardsDataList: newStandardsDataList
            };
        });

        setStandartsState(prevState => {
            return [...prevState, standartToBeAddedBack.standar_name.replace("_", ".")];
        });

    };

    const handleDefaultStandardChange = (index) => {
        setAccessPoint(accessPoint => {
            const updatedStandardsDataList = accessPoint.standardsDataList.map((item, i) => ({
                ...item,
                isDefault: i === index
            }));
            return {
                ...accessPoint,
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

    const resetData = () => {
        setAccessPoint({});
    };

    const handleModalSave = () => {

        const newErrors = {};

        if (!accessPoint.access_point_name) newErrors.access_point_name = 'Access point name is required';
        if (!accessPoint.ssid) newErrors.ssid = 'ssid is required';
        if (!accessPoint.manufacturer) newErrors.manufacturer = 'Manufacturer is required';
        if (!accessPoint.model) newErrors.model = 'Model is required';

        validateNumberInput(accessPoint.firmware_updated_year, 'firmware_updated_year', newErrors);

        if (!accessPoint.standardsDataList.length) newErrors.standardsDataList = 'Standards must be populated';
        if (!accessPoint.antenna_type) newErrors.antenna_type = 'Please select an antenna type';
        if (!accessPoint.physical_location) newErrors.physical_location = 'Please select a physical location';


        accessPoint.standardsDataList.forEach(accessPoint => {

            if (!accessPoint.operationFreq) {
                newErrors.operationFreq = "No Operation Frequency selected for Standart:" + accessPoint.standar_name;
            }

        });

        if (Object.keys(newErrors).length > 0) {
            if (newErrors.standardsDataList) {
                setSnackbarMessage(newErrors.standardsDataList);
                setSnackbarOpen(true);
            }
            else if (newErrors.operationFreq) {
                setSnackbarMessage(newErrors.operationFreq);
                setSnackbarOpen(true);
            }

            setErrors(newErrors);
            return;
        }

        const hasDefault = accessPoint.standardsDataList.some(item => item.isDefault);


        if (!hasDefault) {
            setSnackbarMessage('Set default standard');
            setSnackbarOpen(true);
            return;
        }

        if (accessPoint.id) {

            setErrors({});
            updateAccessPointByUUID(accessPoint);
            setStandartSelections([]);
            resetData();
            setDefaultStandardIndex(-1);
            handleClose();
            return;

        }

        setStandartSelections([]);

        accessPoint.id = uuidv4();

        setErrors({});
        updateAcessPoints(accessPoint);
        resetData();
        setDefaultStandardIndex(-1);
        handleClose();
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setAccessPoint(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const [modalOpen, setModalOpen] = useState(false);

    const showModal = () => {
        setActiveAccessModalData({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleOnClickStandard = (itemData) => {
        setActiveAccessModalData(itemData);
        setModalOpen(true);
    };

    const renderQuestions = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter the name of the access point.">
                        <FormControl fullWidth margin="normal">
                            <TextField
                                type='text'
                                label='Access Point Name'
                                name='access_point_name'
                                id='1'
                                value={accessPoint.access_point_name}
                                error={!!errors.access_point_name}
                                helperText={errors.access_point_name ?? ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter the SSID (Service Set Identifier) for the access point.">
                        <FormControl fullWidth margin="normal">
                            <TextField
                                type='text'
                                label='ssid'
                                name='ssid'
                                value={accessPoint.ssid}
                                error={!!errors.ssid}
                                helperText={errors.ssid ?? ''}
                                id='2'
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Enable this checkbox to hide the SSID broadcast.">
                        <FormControl fullWidth>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        inputProps={{ 'aria-label': 'Hidden ssid' }}
                                        name='hidden_ssid'
                                        checked={accessPoint.hidden_ssid}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label={'Hidden ssid'}
                            />
                        </FormControl>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter the manufacturer of the access point.">
                        <FormControl fullWidth margin="normal">
                            <TextField
                                type='text'
                                label='Manufacturer'
                                name='manufacturer'
                                value={accessPoint.manufacturer}
                                error={!!errors.manufacturer}
                                helperText={errors.manufacturer ?? ''}
                                id='4'
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter the model of the access point.">
                        <FormControl fullWidth margin="normal">
                            <TextField
                                type='text'
                                label='Model'
                                name='model'
                                value={accessPoint.model}
                                error={!!errors.model}
                                helperText={errors.model ?? ''}
                                id='5'
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter the year the firmware was last updated.">
                        <FormControl fullWidth margin="normal">
                            <TextField
                                type='number'
                                label='Firmware updated year'
                                name='firmware_updated_year'
                                value={accessPoint.firmware_updated_year}
                                error={!!errors.firmware_updated_year}
                                helperText={errors.firmware_updated_year ?? ''}
                                id='6'
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Select the type of antenna used by the access point.">
                        <FormControl fullWidth margin="normal">
                            <InputLabel>{'Antenna type'}</InputLabel>
                            <Select
                                label={'Antenna type'}
                                name='antenna_type'
                                value={accessPoint.antenna_type}
                                onChange={(e) => handleInputChange(e)}
                                id='7'
                            >
                                <MenuItem key={'omnidirectional'} value={'omnidirectional'}>{'omnidirectional'}</MenuItem>
                                <MenuItem key={'directional'} value={'directional'}>{'directional'}</MenuItem>
                                <MenuItem key={'batch'} value={'batch'}>{'batch'}</MenuItem>
                                <MenuItem key={'yagi'} value={'yagi'}>{'yagi'}</MenuItem>
                                <MenuItem key={'panel'} value={'panel'}>{'panel'}</MenuItem>
                            </Select>
                            {errors.antenna_type && (
                                <FormHelperText sx={{ color: 'red' }}>{errors.antenna_type}</FormHelperText>
                            )}
                        </FormControl>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Select the physical location where the access point is installed.">
                        <FormControl fullWidth margin="normal">
                            <InputLabel>{'Physical location'}</InputLabel>
                            <Select
                                label={'Physical location'}
                                name='physical_location'
                                value={accessPoint.physical_location}
                                onChange={(e) => handleInputChange(e)}
                                id='7'
                            >
                                <MenuItem key={'SecurePlace'} value={'SecurePlace'}>{'secure place'}</MenuItem>
                                <MenuItem key={'OpenSpace'} value={'OpenSpace'}>{'open space'}</MenuItem>
                                <MenuItem key={'PrivatePlace'} value={'PrivatePlace'}>{'private place'}</MenuItem>

                            </Select>
                            {errors.physical_location && (
                                <FormHelperText sx={{ color: 'red' }}>{errors.physical_location}</FormHelperText>
                            )}
                        </FormControl>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    {accessPoint.standardsDataList?.map((itemData, index) => (
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

                    {accessPoint.standardsDataList?.length > 0 && !accessPoint.standardsDataList.some(item => item.isDefault) && (
                        <Box display="flex" alignItems="center" mt={2}>
                            <InfoIcon color="primary" style={{ marginRight: '8px' }} />
                            <Typography variant="body2" color="textSecondary">
                                Check the utilized standard.
                            </Typography>
                        </Box>
                    )}

                </Grid>

                <Grid item xs={12} sm={6}>
                    <Tooltip title="Click here to add standards .">

                        <Button
                            variant="outlined"
                            onClick={() => showModal()}
                            style={{ color: 'black', borderColor: 'black', width: '100%', height: '56px' }}>
                            {'Add Standard'}
                        </Button>
                    </Tooltip>

                </Grid>
                <StandardModal open={modalOpen} handleClose={closeModal} updateStandartData={updateStandartData} standards={standartsState} activeAccessModalData={activeAccessModalData} />
            </Grid>

        )
    };
    return (
        <Dialog
            fullWidth={true}
            maxWidth={"lg"}
            open={open} onClose={() => handleModalCancel()}>
            <DialogTitle>Add Access Points</DialogTitle>
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


export default AcessPointModal;
