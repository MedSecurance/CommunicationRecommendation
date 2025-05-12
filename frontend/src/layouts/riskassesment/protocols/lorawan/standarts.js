import { React, useState } from 'react';
import {
    Button, Select,
    MenuItem, FormControl, InputLabel, TextField,
    Checkbox, FormControlLabel,
    Grid
} from '@mui/material';

export const EU868 = ({ updateStandartData, handleClose }) => {

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const handleAddStandart = () => {
        // Create a copy of the current prodocolData state
        const updatedProdocolData = { ...prodocolData };
        // Update the prodocolData state with the modified object
        setProdocolData(updatedProdocolData);

        updateStandartData(updatedProdocolData);

        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: 'EU868',
        penetration: 'Moderate',
        device_capacity: 'High',
        isDefault: false,
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Penetration'
                        name='penetration'
                        id='3'
                        value={prodocolData.penetration}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Device Capacity'
                        name='device_capacity'
                        value={prodocolData.device_capacity}
                        disabled={true}
                        id='7'
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
export const US915 = ({ updateStandartData, handleClose }) => {

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const handleAddStandart = () => {

        const updatedProdocolData = { ...prodocolData };

        setProdocolData(updatedProdocolData);

        updateStandartData(updatedProdocolData);

        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: 'US915',
        penetration: 'Moderate',
        device_capacity: 'High',
        isDefault: false,
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Penetration'
                        name='penetration'
                        id='3'
                        value={prodocolData.penetration}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Device Capacity'
                        name='device_capacity'
                        value={prodocolData.device_capacity}
                        disabled={true}
                        id='7'
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
export const AS923 = ({ updateStandartData, handleClose }) => {

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const handleAddStandart = () => {
        // Create a copy of the current prodocolData state
        const updatedProdocolData = { ...prodocolData };
        // Update the prodocolData state with the modified object
        setProdocolData(updatedProdocolData);

        updateStandartData(updatedProdocolData);

        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: 'AS923',
        penetration: 'Good',
        device_capacity: 'High',
        isDefault: false,
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Penetration'
                        name='penetration'
                        id='3'
                        value={prodocolData.penetration}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Device Capacity'
                        name='device_capacity'
                        value={prodocolData.device_capacity}
                        disabled={true}
                        id='7'
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
export const AU915 = ({ updateStandartData, handleClose }) => {


    const handleCancelAddStandart = () => {
        handleClose();
    };

    const handleAddStandart = () => {

        const updatedProdocolData = { ...prodocolData };

        setProdocolData(updatedProdocolData);

        updateStandartData(updatedProdocolData);

        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: 'AU915',
        penetration: 'Moderate',
        device_capacity: 'High',
        isDefault: false
    });

    return (
        <Grid container spacing={2}>

            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Penetration'
                        name='penetration'
                        id='3'
                        value={prodocolData.penetration}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Device Capacity'
                        name='device_capacity'
                        value={prodocolData.device_capacity}
                        disabled={true}
                        id='7'
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
export const CN470 = ({ updateStandartData, handleClose }) => {

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const handleAddStandart = () => {

        const updatedProdocolData = { ...prodocolData };

        setProdocolData(updatedProdocolData);

        updateStandartData(updatedProdocolData);

        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: 'CN470',
        penetration: 'Good',
        device_capacity: 'High',
        isDefault: false
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Penetration'
                        name='penetration'
                        id='3'
                        value={prodocolData.penetration}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Device Capacity'
                        name='device_capacity'
                        value={prodocolData.device_capacity}
                        disabled={true}
                        id='7'
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
export const KR920 = ({ updateStandartData, handleClose }) => {

    const handleCancelAddStandart = () => {
        handleClose();
    };

    const handleAddStandart = () => {

        const updatedProdocolData = { ...prodocolData };

        setProdocolData(updatedProdocolData);

        updateStandartData(updatedProdocolData);

        handleClose();
    };

    const [prodocolData, setProdocolData] = useState({
        standar_name: 'KR920',
        penetration: 'Good',
        device_capacity: 'High',
        isDefault: false
    });


    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Penetration'
                        name='penetration'
                        id='3'
                        value={prodocolData.penetration}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type='text'
                        label='Device Capacity'
                        name='device_capacity'
                        value={prodocolData.device_capacity}
                        disabled={true}
                        id='7'
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



