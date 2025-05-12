

const mapWifiDataToApiData = (wifiData) => {

    var requestData = {
        protocol: 0,
        firewallEnabled: wifiData.firewall_enabled,
        logMonitoringEnabled: wifiData.log_monitoring_enabled,
        RedundancyMeasures : wifiData.redundancy_measures,
        IntrusionDetectionSystem : wifiData.intrusion_detection_system ,
        FirmwareIntegrityCheck : wifiData.firmware_integrity_check ,
        ipRange: wifiData.IP_range,
        backboneNetworkSpeedInMpbs: wifiData.backbone_network_speed_in_Mpbs ?? 0,
        ispConnectionSpeedInMpbs: wifiData.ISP_connection_speed_in_Mpbs ?? 0,
        placement: wifiData.network_details.deployment_details.placement,
        networkName: wifiData.network_name,
        riskAssessmentBody: JSON.stringify(wifiData),
        alreadyImplemented : wifiData.already_implemented,
        riskAssessmentId: wifiData.riskAssessmentId ?? null,
        networkDetails: {
            WifiDeploymentDetails: {
                accessPoints: [
                ],
                lifetimeInYears : wifiData.network_details.deployment_details.lifetime_in_years,
                topologyType : wifiData.network_details.deployment_details.wifi_topology_type
            },
            NetworkFailures: [],
            otherConnectedDevices : wifiData.network_details.other_connected_devices ?? 0
        },
        tvraCves : wifiData.tvra_input
    }

    wifiData.network_details.deployment_details.access_points.forEach(accessPoint => {

        const supported_standards = [];
        const accessPointRequest = {
            accessPointName: accessPoint.access_point_name,
            ssid: accessPoint.ssid,
            hiddenSsid: accessPoint.hidden_ssid,
            manufacturer: accessPoint.manufacturer,
            model: accessPoint.model,
            antennaType: [],
            firmwareUpdatedYear: accessPoint.firmware_updated_year,
            physicalLocation: accessPoint.physical_location,
            operationFrequencies: {}
        };

        accessPointRequest.antennaType.push(accessPoint.antenna_type);

        accessPoint.standardsDataList.forEach(standard => {

            supported_standards.push("_" + standard.standar_name);

            var operationFrequencies = [];

            const { operationFreq } = standard;

            var freq = operationFreq.split('And');

            freq.forEach(freqItem => {
                const freqIn = "_" + freqItem.replace(" ", "");
                operationFrequencies.push(freqIn);
            });

            if (standard.isDefault) {

                operationFrequencies.forEach(freqItem => {
                    accessPointRequest.operationFrequencies[freqItem] = {
                        encryptionAlgorithmUtilized: "RC4",
                        encryptionAlgorithmKeyLengthUtilized: "<string>"
                    };
                });

                accessPointRequest.standardUtilized = "_" + standard.standar_name;
                accessPointRequest.encyprionUtilized = standard.encyprionUtilized;

            }

        });
        accessPointRequest.supportedStandards = supported_standards;
        requestData.networkDetails.WifiDeploymentDetails.accessPoints.push(accessPointRequest);
    });

    requestData.networkDetails.NetworkFailures = mapNetworkFailures(wifiData.network_details.network_failures);

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


export default mapWifiDataToApiData;