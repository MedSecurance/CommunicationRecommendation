import { React } from 'react';
import {
    Button, FormControl, TextField,
    Grid, Typography
} from '@mui/material';

const ConnectionType = ({ connectionTypeData  , addConnectionType}) => {

    const handleAddStandart = () => {
        addConnectionType(connectionTypeData);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Latency in milliseconds'
                        name='latency_in_milliseconds'
                        id='3'
                        value={connectionTypeData.latency_in_milliseconds}
                        disabled={true}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Data Rate In Mbps'
                        value={connectionTypeData.data_rate_in_Mbps}
                        name='data_rate_in_Mbps'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Spectrum Efficiency'
                        value={connectionTypeData.spectrum_efficiency}
                        name='spectrum_efficiency'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Signal Strength in dBm'
                        value={connectionTypeData.signal_strength}
                        name='signal_strength'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Signal to Noise ration in dB'
                        value={connectionTypeData.signal_to_noise_ration}
                        name='signal_to_noise_ration'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <TextField
                        type='text'
                        label='Packet loss rate in %'
                        value={connectionTypeData.packet_loss_rate}
                        name='packet_loss_rate'
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
                        value={connectionTypeData.peak_data_rate.download}
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
                        value={connectionTypeData.peak_data_rate.upload}
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
                        value={connectionTypeData.encryption.type}
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
                        value={connectionTypeData.encryption.key_length}
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
                        value={connectionTypeData.encryption.algorithm}
                        name='emcryption.algorithm'
                        id='4'
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Button
                    variant="outlined"
                    onClick={() => handleAddStandart()}
                    style={{ color: 'black', borderColor: 'black', width: '100%', height: '10px' }}>
                    {'Add Connection Type'}
                </Button>
            </Grid>
        </Grid>
    );
};

export default ConnectionType;

