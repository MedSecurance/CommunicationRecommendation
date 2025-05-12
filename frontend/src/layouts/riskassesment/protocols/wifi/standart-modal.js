import React, { useState, useEffect } from 'react';
import {
    FormControl,
    Dialog, DialogContent, DialogTitle,
    Grid, MenuItem, InputLabel, Select
} from '@mui/material';

import { EightHundredTwoA, EightHundredTwoN, EightHundredTwoB, EightHundredTwoG, EightHundredTwoAc, EightHundredTwoAX } from './standarts';


const StandardModal = ({ open, handleClose, updateStandartData, standards , activeAccessModalData }) => {

    const [standartsState, setStandartsState] = useState([]);
    const [standardValue, setStandartValue] = useState('');


    const handleStandartInputChange = (e) => {
        const { value } = e.target;
        setStandartValue(value);
    };


    useEffect(() => {
        setStandartsState(standards);
        if(activeAccessModalData?.standar_name)
            setStandartValue(activeAccessModalData.standar_name.replace("_","."));
        else{
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
                        <InputLabel>{'Standard'}</InputLabel>
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

    const renderStandartChoice = () => {
        switch (standardValue) {
            case '802.11a':
                return (<EightHundredTwoA updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '802.11b':
                return (<EightHundredTwoB updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '802.11n':
                return (<EightHundredTwoN updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '802.11g':
                return (<EightHundredTwoG updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '802.11ac':
                return (<EightHundredTwoAc updateStandartData={updateStandartData} handleClose={handleClose} />)
            case '802.11ax':
                return (<EightHundredTwoAX updateStandartData={updateStandartData} handleClose={handleClose} />)
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
                {renderStandartChoice()}
            </DialogContent>
        </Dialog>
    );

};


export default StandardModal;
