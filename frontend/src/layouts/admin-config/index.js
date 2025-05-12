import React, { useState, useEffect, useContext } from 'react';
import {
    Grid, Card, Typography, TextField, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { GetAdminConfigs, UpdateAdminConfig } from "services/admin-config-service";
import Icon from "@mui/material/Icon";
import { KeycloakContext } from '../../keycloak-provider';

const AdminConfig = () => {
    const { getAuthHeaders } = useContext(KeycloakContext);

    const [groupedConfigs, setGroupedConfigs] = useState({});

    useEffect(() => {
        fetchData(getAuthHeaders);
    }, []);

    const fetchData = async (getAuthHeaders) => {
        try {
            const response = await GetAdminConfigs(getAuthHeaders);
            const grouped = response.adminConfigs.reduce((acc, config) => {
                if (!acc[config.protocol]) {
                    acc[config.protocol] = [];
                }
                acc[config.protocol].push({
                    ...config,
                    isEditing: false
                });
                return acc;
            }, {});
            setGroupedConfigs(grouped);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleEdit = (protocol, property) => {
        setGroupedConfigs(prev => ({
            ...prev,
            [protocol]: prev[protocol].map(config =>
                config.property === property ? { ...config, isEditing: true } : config
            )
        }));
    };

    const handleValueChange = (e, protocol, property) => {
        const newValue = e.target.value;
        setGroupedConfigs(prev => ({
            ...prev,
            [protocol]: prev[protocol].map(config =>
                config.property === property ? { ...config, value: newValue } : config
            )
        }));
    };

    const handleSave = async (protocol, property, newValue) => {
        if (Number(newValue) < 0) {
            alert("Negative numbers are not allowed.");
            return;
        }
        const payload = {
            updatedAdminConfig: { protocol, property, value: newValue }
        };
        await UpdateAdminConfig(payload, getAuthHeaders);
        setGroupedConfigs(prev => ({
            ...prev,
            [protocol]: prev[protocol].map(config =>
                config.property === property ? { ...config, isEditing: false, value: newValue } : config
            )
        }));
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                                <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                                    <MDTypography variant="h6" color="white">Administrator's Configuration Panel</MDTypography>
                                </MDBox>
                            </MDBox>
                            <MDBox pt={3}>
                                {Object.keys(groupedConfigs).map(protocol => (
                                    <Accordion key={protocol}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="h6">{protocol}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {groupedConfigs[protocol].map(config => (
                                                <Grid container spacing={1} alignItems="center" key={config.property}>
                                                    <Grid item xs={5}>
                                                        <Typography>{config.property}</Typography>
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        {config.isEditing ? (
                                                            <TextField
                                                                value={config.value}
                                                                onChange={(e) => handleValueChange(e, protocol, config.property)}
                                                                onBlur={() => handleSave(protocol, config.property, config.value)}
                                                            />
                                                        ) : (
                                                            <Typography>Value: {config.value}</Typography>
                                                        )}
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Icon
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleEdit(protocol, config.property)}
                                                        >
                                                            edit
                                                        </Icon>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
};

export default AdminConfig;

