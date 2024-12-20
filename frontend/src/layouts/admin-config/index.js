import React, {useState, useEffect, useContext} from 'react';
import {
    Grid, Card, Typography, TextField
} from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {GetAdminConfigs, UpdateAdminConfig} from "services/admin-config-service";
import Icon from "@mui/material/Icon";
import {AuthContext} from '../../auth/AuthContext';

const AdminConfig = () => {
    const {getAuthHeaders} = useContext(AuthContext);
    const [rows, setRows] = useState([]);

    const columns = [
        {Header: "Protocol", accessor: "protocol", align: "left", sortable: true},
        {Header: "Property Name", accessor: "property", align: "left", sortable: true},
        {Header: "Value", accessor: "value", align: "center", sortable: true},
        {Header: "Action", accessor: "action", align: "center", sortable: false}
    ];

    useEffect(() => {
        fetchData(getAuthHeaders);
    }, []);

    const fetchData = async (getAuthHeaders) => {
        try {
            const response = await GetAdminConfigs(getAuthHeaders);
            setRows(response.adminConfigs.map(adminConfig => ({
                protocol: (
                    <Typography display="block" variant="caption" fontWeight="medium">
                        {adminConfig.protocol}
                    </Typography>
                ),
                property: (
                    <Typography display="block" variant="caption" fontWeight="medium">
                        {adminConfig.property}
                    </Typography>
                ),
                value: adminConfig.value,
                isEditing: false
            })));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleEdit = (property, protocol) => {
        setRows(rows.map(row =>
            row.property.props.children === property &&
            row.protocol.props.children === protocol
                ? {...row, isEditing: true}
                : row
        ));
    };

    const handleValueChange = (e, property, protocol) => {
        const newValue = e.target.value;
        if (Number(newValue) < 0) {
            alert("Negative numbers are not allowed."); // Real-time feedback
            return;
        }
        setRows(rows.map(row =>
            row.property.props.children === property &&
            row.protocol.props.children === protocol
                ? {...row, value: newValue}
                : row
        ));
    };

    const handleSave = async (adminConfig, newValue) => {

        if (Number(newValue) < 0) {
            alert("Negative numbers are not allowed."); // Show an alert or any error indication
            // Optionally, reset the value to the previous one
            setRows(rows.map(row =>
                row.property.props.children === adminConfig.property.props.children &&
                row.protocol.props.children === adminConfig.protocol.props.children
                    ? {...row, value: adminConfig.value, isEditing: false}
                    : row
            ));
            return;
        }

        const payload = {
            updatedAdminConfig: {
                protocol: adminConfig.protocol.props.children,
                property: adminConfig.property.props.children,
                value: newValue
            }
        };

        await UpdateAdminConfig(payload, getAuthHeaders);
        setRows(rows.map(row =>
            row.property.props.children === adminConfig.property.props.children &&
            row.protocol.props.children === adminConfig.protocol.props.children
                ? {...row, isEditing: false, value: newValue}
                : row
        ));
    };

    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white">
                                    Administrator's Configuration Panel
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{
                                        columns,
                                        rows: rows.map(row => ({
                                            ...row,
                                            value: row.isEditing ? (
                                                <TextField
                                                    value={row.value}
                                                    onChange={(e) => handleValueChange(e, row.property.props.children, row.protocol.props.children)}
                                                    onBlur={() => handleSave(row, row.value)}
                                                />
                                            ) : (
                                                <Typography display="block" variant="caption" fontWeight="medium">
                                                    {row.value}
                                                </Typography>
                                            ),
                                            action: (
                                                <MDTypography component="a" href="#"
                                                              onClick={() => handleEdit(row.property.props.children, row.protocol.props.children)}
                                                              color="text">
                                                    <Icon>edit</Icon>
                                                </MDTypography>
                                            ),
                                        })),
                                    }}
                                    isSorted={true}
                                    entriesPerPage={true}
                                    showTotalEntries={true}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
};

export default AdminConfig;