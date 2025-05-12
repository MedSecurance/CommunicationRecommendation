import React, { useState, useEffect } from 'react';
import {
    FormControl,
    Dialog, DialogContent, DialogTitle,
    Grid, MenuItem, InputLabel, Select
} from '@mui/material';

import { ThreeG, FourG, FiveG } from './standarts';


const AddStandardModal = ({ open, handleClose, updateStandartData, standards, activeAccessModalData }) => {


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
            case '3G':
                return (<ThreeG updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '4G':
                return (<FourG updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '5G':
                return (<FiveG updateStandartData={updateStandartData} handleClose={handleClose} />)
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


export default AddStandardModal;
