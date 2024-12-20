import React, { useState, useEffect } from 'react';
import {
    FormControl,
    Dialog, DialogContent, DialogTitle,
    Grid, MenuItem, InputLabel, Select
} from '@mui/material';

import { US915, EU868, AS923, AU915, CN470, KR920 } from './standarts';


const FrequencyBandModal = ({ open, handleClose, updateStandartData, standards, activeAccessModalData }) => {


    const [standartsState, setStandartsState] = useState([]);
    const [standardValue, setStandartValue] = useState('');

    const handleStandartInputChange = (e) => {
        const { name, value } = e.target;
        setStandartValue(value);
    };


    useEffect(() => {
        setStandartsState(standards);
        if (activeAccessModalData?.standar_name)
            setStandartValue(activeAccessModalData.standar_name);
        else {
            setStandartValue('');
        }
    }, [open]);


    const handleModalCancel = () => {
        handleClose();
    };

    const renderQuestions = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>{'Version'}</InputLabel>
                        <Select
                            label={'Standart'}
                            name='standard'
                            onChange={(e) => handleStandartInputChange(e)}
                            id='5'
                        >
                            {
                                standartsState?.map((itemData) => (

                                    <MenuItem key={itemData} value={itemData}>{itemData}</MenuItem>

                                ))}
                        </Select>
                    </FormControl>

                </Grid>
            </Grid>
        )
    };

    const renderVersionChoice = () => {
        switch (standardValue) {
            case 'EU868':
                return (<EU868 updateStandartData={updateStandartData} handleClose={handleClose} />)
            case 'US915':
                return (<US915 updateStandartData={updateStandartData} handleClose={handleClose} />)
            case 'AS923':
                return (<AS923 updateStandartData={updateStandartData} setStandartValue={setStandartValue} />)
            case 'AU915':
                return (<AU915 updateStandartData={updateStandartData} setStandartValue={setStandartValue} />)
            case 'CN470':
                return (<CN470 updateStandartData={updateStandartData} setStandartValue={setStandartValue} />)
            case 'KR920':
                return (<KR920 updateStandartData={updateStandartData} setStandartValue={setStandartValue} />)
            default:
                return (''
                );
        }
    };


    return (
        <Dialog
            fullWidth={true}
            maxWidth={"md"} open={open} onClose={() => handleModalCancel()}>
            <DialogTitle>Add Standard</DialogTitle>
            <DialogContent>
                {renderQuestions()}
                {renderVersionChoice()}
            </DialogContent>
        </Dialog>
    );

};


export default FrequencyBandModal;
