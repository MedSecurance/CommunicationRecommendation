import { React, useState } from 'react';
import {
    Button, FormControl, TextField,
    Grid, Typography
} from '@mui/material';

export const ThreeG = ({ updateStandartData, handleClose }) => {

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
         standar_name: '3G',
        latency_in_milliseconds: '<100',
        data_rate_in_Mbps: '1 - 2',
        spectrum_efficiency: 'Moderate',
        signal_strength : '-70 - -95',
        signal_to_noise_ration : '5 - 15',
        packet_loss_rate : '1 - 5',
        peak_data_rate : { download : '2' , upload : '2' },
        encryption: {type : 'A5/3' , key_length : '128 bits' , algorithm : 'KASUMI' },
        isDefault: false
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Latency in milliseconds'
                        name='latency_in_milliseconds'
                        id='3'
                        value={prodocolData.latency_in_milliseconds}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Data Rate In Mbps'
                        value={prodocolData.data_rate_in_Mbps}
                        name='data_rate_in_Mbps'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Spectrum Efficiency'
                        value={prodocolData.spectrum_efficiency}
                        name='spectrum_efficiency'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Signal Strength in dBm'
                        value={prodocolData.signal_strength}
                        name='signal_strength'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Signal to Noise ration in dB'
                        value={prodocolData.signal_to_noise_ration}
                        name='signal_to_noise_ration'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Packet loss rate in %'
                        value={prodocolData.packet_loss_rate}
                        name='packet_loss_rate'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'left', gridColumn: 'auto' }}>
                <Typography variant="h6">{'Peak data rate in Mbps'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Download'
                        value={prodocolData.peak_data_rate.download}
                        disabled={true}
                        name='peak_data_rate.download'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Upload'
                        value={prodocolData.peak_data_rate.upload}
                        disabled={true}
                        name='peak_data_rate.Upload'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'left', gridColumn: 'auto' }}>
                <Typography variant="h6">{'Encryption'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Encryption Type'
                        value={prodocolData.encryption.type}
                        disabled={true}
                        name='emcryption.type'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Encryption Key Length'
                        value={prodocolData.encryption.key_length}
                        disabled={true}
                        name='emcryption.key_length'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Encryption Algorithm'
                        value={prodocolData.encryption.algorithm}
                        disabled={true}
                        name='emcryption.algorithm'
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
export const FourG = ({ updateStandartData, handleClose }) => {

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
        standar_name: '4G',
        latency_in_milliseconds: '<50',
        data_rate_in_Mbps: '5 - 300',
        spectrum_efficiency: 'High',
        signal_strength : '-65 - -90',
        signal_to_noise_ration : '10 - 25',
        packet_loss_rate : '0.1 - 1',
        peak_data_rate : { download : '300' , upload : '100' },
        encryption: {type : 'AES' , key_length : '128 bits' , algorithm : 'AES' },
        isDefault: false
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Latency in milliseconds'
                        name='latency_in_milliseconds'
                        id='3'
                        value={prodocolData.latency_in_milliseconds}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Data Rate In Mbps'
                        value={prodocolData.data_rate_in_Mbps}
                        name='data_rate_in_Mbps'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Spectrum Efficiency'
                        value={prodocolData.spectrum_efficiency}
                        name='spectrum_efficiency'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Signal Strength in dBm'
                        value={prodocolData.signal_strength}
                        name='signal_strength'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Signal to Noise ration in dB'
                        value={prodocolData.signal_to_noise_ration}
                        name='signal_to_noise_ration'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Packet loss rate in %'
                        value={prodocolData.packet_loss_rate}
                        name='packet_loss_rate'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'left', gridColumn: 'auto' }}>
                <Typography variant="h6">{'Peak data rate in Mbps'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Download'
                        value={prodocolData.peak_data_rate.download}
                        disabled={true}
                        name='peak_data_rate.download'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Upload'
                        value={prodocolData.peak_data_rate.upload}
                        disabled={true}
                        name='peak_data_rate.Upload'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'left', gridColumn: 'auto' }}>
                <Typography variant="h6">{'Encryption'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Encryption Type'
                        value={prodocolData.encryption.type}
                        disabled={true}
                        name='emcryption.type'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Encryption Key Length'
                        value={prodocolData.encryption.key_length}
                        disabled={true}
                        name='emcryption.key_length'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Encryption Algorithm'
                        value={prodocolData.encryption.algorithm}
                        disabled={true}
                        name='emcryption.algorithm'
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
export const FiveG = ({ updateStandartData, handleClose }) => {

   
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
        standar_name: '5G',
        latency_in_milliseconds: '<1',
        data_rate_in_Mbps: '50 - 2000',
        spectrum_efficiency: 'Very High',
        signal_strength : '-60 - -85',
        signal_to_noise_ration : '15 - 30',
        packet_loss_rate : '0.01 - 0.1',
        peak_data_rate : { download : '2000' , upload : '1000' },
        encryption: {type : 'AES' , key_length : '256 bits' , algorithm : 'AES' },
        isDefault: false
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Latency in milliseconds'
                        name='latency_in_milliseconds'
                        id='3'
                        value={prodocolData.latency_in_milliseconds}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Data Rate In Mbps'
                        value={prodocolData.data_rate_in_Mbps}
                        name='data_rate_in_Mbps'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Spectrum Efficiency'
                        value={prodocolData.spectrum_efficiency}
                        name='spectrum_efficiency'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Signal Strength in dBm'
                        value={prodocolData.signal_strength}
                        name='signal_strength'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Signal to Noise ration in dB'
                        value={prodocolData.signal_to_noise_ration}
                        name='signal_to_noise_ration'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Packet loss rate in %'
                        value={prodocolData.packet_loss_rate}
                        name='packet_loss_rate'
                        disabled={true}
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'left', gridColumn: 'auto' }}>
                <Typography variant="h6">{'Peak data rate in Mbps'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Download'
                        value={prodocolData.peak_data_rate.download}
                        disabled={true}
                        name='peak_data_rate.download'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Upload'
                        value={prodocolData.peak_data_rate.upload}
                        disabled={true}
                        name='peak_data_rate.Upload'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'left', gridColumn: 'auto' }}>
                <Typography variant="h6">{'Encryption'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Encryption Type'
                        value={prodocolData.encryption.type}
                        disabled={true}
                        name='emcryption.type'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Encryption Key Length'
                        value={prodocolData.encryption.key_length}
                        disabled={true}
                        name='emcryption.key_length'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Encryption Algorithm'
                        value={prodocolData.encryption.algorithm}
                        disabled={true}
                        name='emcryption.algorithm'
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

