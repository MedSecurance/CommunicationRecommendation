

const mapBluetoothMapperApiData = (bluetoothData) => {

    var requestData = {
        networkName: bluetoothData.mesh_name,
        maxSupportedDevices: bluetoothData.maximum_supported_devices,
        alreadyImplemented: bluetoothData.already_implemented,
        logMonitoringEnabled: bluetoothData.log_monitoring_enabled,
        redundancyMeasures: bluetoothData.redundancy_measures,
        intrusionDetectionSystem: bluetoothData.intrusion_detection_system,
        firmwareIntegrityCheck: bluetoothData.firmware_integrity_check,
        dataPrivacyMeasures: { atRest: true, inTransit: true },
        securityAuditFrequencyInYears: bluetoothData.security_audit_frequency_in_years,
        accessControlMechanism: bluetoothData.access_control_mechanism,
        backboneNetworkSpeedInMpbs: bluetoothData.backbone_network_speed_in_mpbs,
        riskAssessmentBody: JSON.stringify(bluetoothData),
        riskAssessmentId: bluetoothData.riskAssessmentId ?? null,
        networkDetails: {
            deploymentDetails: {
                topologyType: bluetoothData.mesh_details.deployment_details.topology_type,
                areaCoverageInMeters: bluetoothData.mesh_details.deployment_details.area_coverage_in_meters,
                levelOfInterference: 2,
                lifetimeInYears: bluetoothData.mesh_details.deployment_details.lifetime_in_years,
                typicalLatencyInMs: bluetoothData.mesh_details.deployment_details.typical_latency_in_ms,
                bandwidthInMbps: bluetoothData.mesh_details.deployment_details.bandwidth_in_mbps,
                bleNodes: [
                ]
            },
            networkFailures: [],
            otherConnectedDevices: 0
        }
    }

    bluetoothData.mesh_details.deployment_details.access_points.forEach(accessPoint => {

        const blNodeRequest = {

            supportedVersions: [],
            versionUtilized: '',
            gatewayIntermediateDevice: accessPoint.gateway_intermediate_device === 'No' ? false : true,
            deviceName: accessPoint.device_name,
            macAddress: accessPoint.mac_address,
            manufacturer: accessPoint.manufacturer,
            model: accessPoint.model,
            antennaType: accessPoint.antenna_type,
            authenticationMethod: accessPoint.authentication_method,
            dataIntegrity: accessPoint.data_integrity,
            secureCommunicationChannel: accessPoint.secure_communication_channel,
            firmwareUpdatedYear: accessPoint.firmware_updated_year,
            physicalLocation: accessPoint.physical_location
        };


        accessPoint.standardsDataList.forEach(standard => {

            blNodeRequest.supportedVersions.push(standard.standar_name);

            if (standard.isDefault) {
                blNodeRequest.versionUtilized = standard.standar_name;
            }
        });

        requestData.networkDetails.deploymentDetails.bleNodes.push(blNodeRequest);
    });

    requestData.networkDetails.NetworkFailures = mapNetworkFailures(bluetoothData.mesh_details.network_failures);

    return requestData;

};

function mapNetworkFailures(network_failures) {

    var mappedNetworkFailures = [];

    network_failures?.forEach(failure => {
        var requestNetworkFailure = {
            CauseOfFailure: failure.cause_of_failure,
            DowntimeInMinutes: failure.downtime_in_minutes,
            TimeToRepairInMinutes: failure.time_to_repair_in_minutes,
            FailureHandling: failure.failure_handling
        };

        mappedNetworkFailures.push(requestNetworkFailure);

    });

    return mappedNetworkFailures;

}


export default mapBluetoothMapperApiData;