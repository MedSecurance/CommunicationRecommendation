import { React, useState } from 'react';
import {
    Button, Select,
    MenuItem, FormControl, InputLabel, TextField,
    Grid
} from '@mui/material';

export const EightHundredTwoA = ({ updateStandartData, handleClose }) => {

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const handleAddStandart = () => {
        // Create a copy of the current prodocolData state
        const updatedProdocolData = { ...prodocolData };
        // Update the prodocolData state with the modified object
        setProdocolData(updatedProdocolData);

        updateStandartData(updatedProdocolData);
        // Reset the standart value if needed
        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: '802_11a',
        operationFreq: '5 GHz',
        isDefault: false,
        encyprionUtilized: 'WPA2'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setProdocolData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <Grid container spacing={2}  >
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Operation Frequencies'
                        name='operationFreq'
                        id='1'
                        value={prodocolData.operationFreq}
                        onChange={handleInputChange}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>{'Encryption Utilized'}</InputLabel>
                    <Select
                        label={'Encryption Utilized'}
                        id='923'
                        name='encyprionUtilized'
                        value={prodocolData.encyprionUtilized}
                        onChange={handleInputChange}
                    >
                        <MenuItem key={'WEP'} value={'WEP'}>{'WEP'}</MenuItem>
                        <MenuItem key={'WPA'} value={'WPA'}>{'WPA'}</MenuItem>
                        <MenuItem key={'WPA2'} value={'WPA2'}>{'WPA2'}</MenuItem>
                        <MenuItem key={'Open'} value={'Open'}>{'Open'}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button
                    variant="outlined"
                    onClick={() => handleAddStandart()}
                    style={{ color: 'black', borderColor: 'black', width: '100%', height: '10px' }}>
                    {'Add Standart'}
                </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button
                    variant="outlined"
                    onClick={() => handleCancelAddStandart()}
                    style={{ color: 'red', borderColor: 'black', width: '100%', height: '10px' }}>
                    {'Cancel'}
                </Button>
            </Grid>
        </Grid>
    );
};

export const EightHundredTwoN = ({ updateStandartData, handleClose }) => {

    const handleAddStandart = () => {
        // Create a copy of the current prodocolData state
        const updatedProdocolData = { ...prodocolData };
        // Update the prodocolData state with the modified object
        setProdocolData(updatedProdocolData);
        // Call the function to update standart data (assuming this function works correctly)
        updateStandartData(updatedProdocolData);

        handleClose();
    };


    const [prodocolData, setProdocolData] = useState({
        standar_name: '802_11n',
        operationFreq: '',
        isDefault: false,
        encyprionUtilized: 'WPA2'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setProdocolData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const handleOperationFrequencyInputChange = (e) => {
        const value = e.target.value;
        setProdocolData(prevState => ({
            ...prevState,
            'operationFreq': value,
        }));
    };

    return (

        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>{'Operation Frequencies'}</InputLabel>
                    <Select
                        label={'Operation Frequencies'}
                        id='12'
                        onChange={(e) => handleOperationFrequencyInputChange(e)}
                        name='operationFreq'
                    >
                        <MenuItem key={'2_4gHz'} selected={true} value={'2_4gHz'}>{'2_4 GHz'}</MenuItem>
                        <MenuItem key={'5gHz'} value={'5gHz'}>{'5 GHz'}</MenuItem>
                        <MenuItem key={'2_4gHzAnd5gHz'} value={'2_4gHzAnd5gHz'}>{'2_4 GHz AND 5GHz'}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>{'Encryption Utilized'}</InputLabel>
                    <Select
                        label={'Encryption Utilized'}
                        id='923'
                        name='encyprionUtilized'
                        value={prodocolData.encyprionUtilized}
                        onChange={handleInputChange}
                    >
                        <MenuItem key={'WPA2'} value={'WPA2'}>{'WPA2'}</MenuItem>
                        <MenuItem key={'Open'} value={'Open'}>{'Open'}</MenuItem>
                        <MenuItem key={'WPA3'} value={'WPA3'}>{'WPA3'}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button
                    variant="outlined"
                    onClick={() => handleAddStandart()}
                    style={{ color: 'black', borderColor: 'black', width: '100%', height: '10px' }}>
                    {'Add Standart'}
                </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button
                    variant="outlined"
                    onClick={() => handleCancelAddStandart()}
                    style={{ color: 'red', borderColor: 'black', width: '100%', height: '10px' }}>
                    {'Cancel'}
                </Button>
            </Grid>
        </Grid>
    );

};

export const EightHundredTwoB = ({ updateStandartData, handleClose }) => {


    const handleAddStandart = () => {
        // Create a copy of the current prodocolData state
        const updatedProdocolData = { ...prodocolData };
        // Update the prodocolData state with the modified object
        setProdocolData(updatedProdocolData);
        // Call the function to update standart data (assuming this function works correctly)
        updateStandartData(updatedProdocolData);
        // Reset the standart value if needed
        handleClose();
    };

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: '802_11b',
        operationFreq: '2_4 GHz',
        isDefault: false,
        encyprionUtilized: 'WPA2'

    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setProdocolData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Operation Frequencies'
                        name='operationFreq'
                        id='1'
                        value={prodocolData.operationFreq}
                        onChange={handleInputChange}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>{'Encryption Utilized'}</InputLabel>
                    <Select
                        label={'Encryption Utilized'}
                        id='923'
                        name='encyprionUtilized'
                        value={prodocolData.encyprionUtilized}
                        onChange={handleInputChange}
                    >
                        <MenuItem key={'WEP'} value={'WEP'}>{'WEP'}</MenuItem>
                        <MenuItem key={'WPA'} value={'WPA'}>{'WPA'}</MenuItem>
                        <MenuItem key={'WPA2'} value={'WPA2'}>{'WPA2'}</MenuItem>
                        <MenuItem key={'Open'} value={'Open'}>{'Open'}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button
                    variant="outlined"
                    onClick={() => handleAddStandart()}
                    style={{ color: 'black', borderColor: 'black', width: '100%', height: '10px' }}>
                    {'Add Standart'}
                </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button
                    variant="outlined"
                    onClick={() => handleCancelAddStandart()}
                    style={{ color: 'red', borderColor: 'black', width: '100%', height: '10px' }}>
                    {'Cancel'}
                </Button>
            </Grid>
        </Grid>
    )
};

export const EightHundredTwoG = ({ updateStandartData, handleClose }) => {


    const handleAddStandart = () => {
        // Create a copy of the current prodocolData state
        const updatedProdocolData = { ...prodocolData };

        setProdocolData(updatedProdocolData);
        // Call the function to update standart data (assuming this function works correctly)
        updateStandartData(updatedProdocolData);
        // Reset the standart value if needed
        handleClose();
    };

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: '802_11g',
        operationFreq: '2_4 GHz',
        isDefault: false,
        encyprionUtilized: 'WPA2'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setProdocolData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Operation Frequencies'
                        name='operationFreq'
                        id='1'
                        value={prodocolData.operationFreq}
                        onChange={handleInputChange}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>{'Encryption Utilized'}</InputLabel>
                    <Select
                        label={'Encryption Utilized'}
                        id='923'
                        name='encyprionUtilized'
                        value={prodocolData.encyprionUtilized}
                        onChange={handleInputChange}
                    >
                        <MenuItem key={'WEP'} value={'WEP'}>{'WEP'}</MenuItem>
                        <MenuItem key={'WPA'} value={'WPA'}>{'WPA'}</MenuItem>
                        <MenuItem key={'WPA2'} value={'WPA2'}>{'WPA2'}</MenuItem>
                        <MenuItem key={'Open'} value={'Open'}>{'Open'}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button
                    variant="outlined"
                    onClick={() => handleAddStandart()}
                    style={{ color: 'black', borderColor: 'black', width: '100%', height: '10px' }}>
                    {'Add Standart'}
                </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button
                    variant="outlined"
                    onClick={() => handleCancelAddStandart()}
                    style={{ color: 'red', borderColor: 'black', width: '100%', height: '10px' }}>
                    {'Cancel'}
                </Button>
            </Grid>
        </Grid>
    )
};

export const EightHundredTwoAc = ({ updateStandartData, handleClose }) => {


    const handleAddStandart = () => {
        // Create a copy of the current prodocolData state
        const updatedProdocolData = { ...prodocolData };
        // Update the prodocolData state with the modified object
        setProdocolData(updatedProdocolData);

        updateStandartData(updatedProdocolData);
        // Reset the standart value if needed
        handleClose();
    };

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: '802_11ac',
        operationFreq: '5GHz',
        frequencyType: 'U-NII bands',
        channelBand: '',
        data_rate_in_Mbps: '',
        numberOfChannels: '',
        range_in_meters: '',
        gatewayIntermediateDevice: 'Yes',
        minimum_signal_sensitivity_in_dbm: 0,
        averagePowerCons: '1 W',
        topology_type: '',
        isDefault: false,
        encyprionUtilized: 'WPA2'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setProdocolData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Operation Frequencies'
                        name='operationFreq'
                        id='1'
                        value={prodocolData.operationFreq}
                        onChange={handleInputChange}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>{'Encryption Utilized'}</InputLabel>
                    <Select
                        label={'Encryption Utilized'}
                        id='923'
                        name='encyprionUtilized'
                        value={prodocolData.encyprionUtilized}
                        onChange={handleInputChange}
                    >
                        <MenuItem key={'WPA2'} value={'WPA2'}>{'WPA2'}</MenuItem>
                        <MenuItem key={'WPA3'} value={'WPA3'}>{'WPA3'}</MenuItem>
                        <MenuItem key={'Open'} value={'Open'}>{'Open'}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button
                    variant="outlined"
                    onClick={() => handleAddStandart()}
                    style={{ color: 'black', borderColor: 'black', width: '100%', height: '10px' }}>
                    {'Add Standart'}
                </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button
                    variant="outlined"
                    onClick={() => handleCancelAddStandart()}
                    style={{ color: 'red', borderColor: 'black', width: '100%', height: '10px' }}>
                    {'Cancel'}
                </Button>
            </Grid>
        </Grid>
    );
};

export const EightHundredTwoAX = ({ updateStandartData, handleClose }) => {

    const handleAddStandart = () => {
        // Create a copy of the current prodocolData state
        const updatedProdocolData = { ...prodocolData };
        // Update the prodocolData state with the modified object
        setProdocolData(updatedProdocolData);

        updateStandartData(updatedProdocolData);
        // Reset the standart value if needed
        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: '802_11ax',
        operationFreq: '',
        frequencyType: '',
        channelBand: '',
        dataRate: '',
        numberOfChannels: '',
        range: '',
        gatewayIntermediateDevice: 'Yes',
        minimumSignalSen: 0,
        topology_type: '',
        isDefault: false,
        averagePowerCons: '0.5 W',
        encyprionUtilized: 'WPA3'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setProdocolData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const handleOperationFrequencyInputChange = (e) => {
        const value = e.target.value;
        setProdocolData(prevState => ({
            ...prevState,
            'operationFreq': value,
        }));
    };

    return (

        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>{'Operation Frequencies'}</InputLabel>
                    <Select
                        label={'Operation Frequencies'}
                        id='12'
                        onChange={(e) => handleOperationFrequencyInputChange(e)}
                        name='operationalFrequencies'
                    >
                        <MenuItem key={'2_4gHz'} selected={true} value={'2_4gHz'}>{'2_4 GHz'}</MenuItem>
                        <MenuItem key={'5gHz'} value={'5gHz'}>{'5 GHz'}</MenuItem>
                        <MenuItem key={'6gHz'} value={'6gHz'}>{'6 GHz'}</MenuItem>
                        <MenuItem key={'2_4gHzAnd5gHz'} value={'2_4gHzAnd5gHz'}>{'2_4 GHz AND 5GHz'}</MenuItem>
                        <MenuItem key={'2_4gHzAnd6gHz'} value={'2_4gHzAnd6gHz'}>{'2_4 GHz AND 6GHz'}</MenuItem>
                        <MenuItem key={'5gHzAnd6gHz'} value={'5gHzAnd6gHz'}>{'5 GHz AND 6GHz'}</MenuItem>
                        <MenuItem key={'2_4gHzAnd5gHzAnd6gHz'} value={'2_4gHzAnd5gHzAnd6gHz'}>{'2_4 GHz AND 5GHz AND 6GHz'}</MenuItem>

                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>{'Encryption Utilized'}</InputLabel>
                    <Select
                        label={'Encryption Utilized'}
                        id='923'
                        name='encyprionUtilized'
                        value={prodocolData.encyprionUtilized}
                        onChange={handleInputChange}
                    >
                        <MenuItem key={'WPA3'} value={'WPA3'}>{'WPA3'}</MenuItem>
                        <MenuItem key={'Open'} value={'Open'}>{'Open'}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button
                    variant="outlined"
                    onClick={() => handleAddStandart()}
                    style={{ color: 'black', borderColor: 'black', width: '100%', height: '10px' }}>
                    {'Add Standart'}
                </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button
                    variant="outlined"
                    onClick={() => handleCancelAddStandart()}
                    style={{ color: 'red', borderColor: 'black', width: '100%', height: '10px' }}>
                    {'Cancel'}
                </Button>
            </Grid>
        </Grid>
    );

};