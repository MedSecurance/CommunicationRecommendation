import { React, useState } from 'react';
import {
    Button, FormControl, TextField,
    Grid
} from '@mui/material';

export const FourZero = ({ updateStandartData, handleClose }) => {

    const handleAddStandart = () => {
        // Create a copy of the current prodocolData state
        const updatedProdocolData = { ...prodocolData };
        // Update the prodocolData state with the modified object
        setProdocolData(updatedProdocolData);

        updateStandartData(updatedProdocolData);

        handleClose();
    };

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: '4.0',
        channelBand: '1 MHz',
        data_rate_in_Mbps: '1 Mbps',
        isDefault: false
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Channel Bandwidth'
                        name='channelBand'
                        id='3'
                        value={prodocolData.channelBand}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Data Rate In Mbps'
                        name='data_rate_in_Mbps'
                        id='4'
                        value={prodocolData.data_rate_in_Mbps}
                        disabled={true}
                    />
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
export const FourOne = ({ updateStandartData, handleClose }) => {


    const handleAddStandart = () => {
        // Create a copy of the current prodocolData state
        const updatedProdocolData = { ...prodocolData };
        // Update the prodocolData state with the modified object
        setProdocolData(updatedProdocolData);

        updateStandartData(updatedProdocolData);

        handleClose();
    };

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: '4.1',
        channelBand: '1 MHz',
        data_rate_in_Mbps: '1 Mbps',
        isDefault: false,
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Channel Bandwidth'
                        name='channelBand'
                        id='3'
                        value={prodocolData.channelBand}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Data Rate In Mbps'
                        name='data_rate_in_Mbps'
                        value={prodocolData.data_rate_in_Mbps}
                        disabled={true}
                        id='4'
                    />
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
export const FourTwo = ({ updateStandartData, handleClose }) => {

    const handleAddStandart = () => {
        // Create a copy of the current prodocolData state
        const updatedProdocolData = { ...prodocolData };
        // Update the prodocolData state with the modified object
        setProdocolData(updatedProdocolData);
        // Call the function to update standart data (assuming this function works correctly)
        updateStandartData(updatedProdocolData);

        handleClose();
    };

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: '4.2',
        channelBand: '1 MHz',
        data_rate_in_Mbps: '1 Mbps',
        isDefault: false
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Channel Bandwidth'
                        name='channelBand'
                        id='3'
                        value={prodocolData.channelBand}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Data Rate In Mbps'
                        name='data_rate_in_Mbps'
                        value={prodocolData.data_rate_in_Mbps}
                        disabled={true}
                        id='4'
                    />
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
export const FiveZero = ({ updateStandartData, handleClose }) => {


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
        standar_name: '5.0',
        channelBand: '2 MHz',
        data_rate_in_Mbps: '2 Mbps',
        isDefault: false
    });


    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Channel Bandwidth'
                        name='channelBand'
                        id='3'
                        value={prodocolData.channelBand}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Data Rate In Mbps'
                        name='data_rate_in_Mbps'
                        id='4'
                    />
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
export const FiveOne = ({ updateStandartData, handleClose }) => {


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
        standar_name: '5.1',
        channelBand: '2 MHz',
        data_rate_in_Mbps: '2 Mbps',
        isDefault: false
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Channel Bandwidth'
                        name='channelBand'
                        id='3'
                        value={prodocolData.channelBand}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Data Rate In Mbps'
                        name='data_rate_in_Mbps'
                        id='4'
                    />
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
export const FiveTwo = ({ updateStandartData, handleClose }) => {


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
        standar_name: '5.2',
        channelBand: '2 MHz',
        data_rate_in_Mbps: '2 Mbps',
        isDefault: false
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Channel Bandwidth'
                        name='channelBand'
                        id='3'
                        value={prodocolData.channelBand}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Data Rate In Mbps'
                        name='data_rate_in_Mbps'
                        value={prodocolData.data_rate_in_Mbps}
                        id='4'
                    />
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
export const FiveThree = ({ updateStandartData, handleClose }) => {


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
        standar_name: '5.3',
        channelBand: '2 MHz',
        data_rate_in_Mbps: '2 Mbps',
        isDefault: false
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Channel Bandwidth'
                        name='channelBand'
                        id='3'
                        value={prodocolData.channelBand}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Data Rate In Mbps'
                        name='data_rate_in_Mbps'
                        value={prodocolData.data_rate_in_Mbps}
                        id='4'
                    />
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
export const FiveFour = ({ updateStandartData, handleClose }) => {


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
        standar_name: '5.4',
        channelBand: '2 MHz',
        data_rate_in_Mbps: '2 Mbps',
        isDefault: false
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Channel Bandwidth'
                        name='channelBand'
                        id='3'
                        value={prodocolData.channelBand}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Data Rate In Mbps'
                        name='data_rate_in_Mbps'
                        value={prodocolData.data_rate_in_Mbps}
                        id='4'
                    />
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

