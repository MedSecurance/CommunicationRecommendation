import React, { useState, useEffect } from 'react';
import {
    FormControl,
    Dialog, DialogContent, DialogTitle,
    Grid, MenuItem, InputLabel, Select
} from '@mui/material';

import { FourZero, FourOne, FourTwo, FiveZero, FiveOne, FiveTwo, FiveThree, FiveFour } from './standarts';


const VersionModal = ({ open, handleClose, updateStandartData, standards, activeAccessModalData }) => {


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
            case '4.0':
                return (<FourZero updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '4.1':
                return (<FourOne updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '4.2':
                return (<FourTwo updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '5.0':
                return (<FiveZero updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '5.1':
                return (<FiveOne updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '5.2':
                return (<FiveTwo updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '5.3':
                return (<FiveThree updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '5.4':
                return (<FiveFour updateStandartData={updateStandartData} handleClose={handleClose} />)    
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


export default VersionModal;
