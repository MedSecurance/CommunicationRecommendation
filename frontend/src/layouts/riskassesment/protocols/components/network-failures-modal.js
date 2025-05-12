import React, { useState, useEffect } from 'react';
import {
    Button, FormControl, TextField,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, Snackbar, Alert, MenuItem, InputLabel, Select, FormHelperText
} from '@mui/material';

import { v4 as uuidv4 } from 'uuid';


const NetworkFailures = ({ open, handleClose, updateNetworkFailures, networkFailureData, updateNetworkFailersByUUID, causeOffailures }) => {

    // Validation state section
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };


    const [networkFailure, setNetworkFailures] = useState({
        cause_of_failure: '',
        downtime_in_minutes: 0,
        time_to_repair_in_minutes: 0,
        failure_handling: '',
        id: ''
    });

    useEffect(() => {
        setNetworkFailures({
            cause_of_failure: networkFailureData.cause_of_failure ?? '',
            downtime_in_minutes: networkFailureData.downtime_in_minutes ?? 0,
            time_to_repair_in_minutes: networkFailureData.time_to_repair_in_minutes ?? 0,
            failure_handling: networkFailureData.failure_handling ?? '',
            id: networkFailureData.id ?? ''
        });

    }, [open]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNetworkFailures(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleModalCancel = () => {
        setErrors({});
        resetData();
        handleClose();
    };

    const resetData = () => {
        setNetworkFailures({});
    };

    const handleModalSave = () => {

        const newErrors = {};
        if (!networkFailure.cause_of_failure) newErrors.cause_of_failure = 'Cause Of Failure is required';
        if (!networkFailure.failure_handling) newErrors.failure_handling = 'Failure Handling is required';

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

        if (networkFailure.id) {

            setErrors({});
            updateNetworkFailersByUUID(networkFailure);
            resetData();
            handleClose();
            return;

        }

        networkFailure.id = uuidv4();

        setErrors({});
        updateNetworkFailures(networkFailure);
        resetData();
        handleClose();
    };


    const renderQuestions = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>{'Cause Of Failure'}</InputLabel>
                        <Select
                            label={'Cause Of Failure'}
                            name='cause_of_failure'
                            value={networkFailure.cause_of_failure ?? ""}
                            onChange={(e) => handleInputChange(e)}
                            id='9334'
                        >
                            {
                                causeOffailures?.map((itemData) => (
                                    <MenuItem key={itemData.value} value={itemData.value}>{itemData.displayValue}</MenuItem>
                                ))}

                        </Select>
                        {errors.cause_of_failure && (
                            <FormHelperText sx={{ color: 'red' }}>{errors.cause_of_failure}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            type='number'
                            label='Downtime In Minutes'
                            name='downtime_in_minutes'
                            value={networkFailure.downtime_in_minutes}
                            error={!!errors.downtime_in_minutes}
                            helperText={errors.downtime_in_minutes ?? ''}
                            id='6'
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            type='number'
                            label='Time To Repair In Minutes'
                            name='time_to_repair_in_minutes'
                            value={networkFailure.time_to_repair_in_minutes}
                            error={!!errors.time_to_repair_in_minutes}
                            helperText={errors.time_to_repair_in_minutes ?? ''}
                            id='6'
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            type='text'
                            label='Failure Handling'
                            name='failure_handling'
                            id='1'
                            value={networkFailure.failure_handling}
                            error={!!errors.failure_handling}
                            helperText={errors.failure_handling ?? ''}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Grid>
            </Grid>
        )
    };



    return (
        <Dialog open={open} onClose={() => handleModalCancel()}>
            <DialogTitle>Add Network Failures</DialogTitle>
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


export default NetworkFailures;
