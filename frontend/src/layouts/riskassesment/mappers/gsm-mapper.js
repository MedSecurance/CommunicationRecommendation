

const mapGsmApiData = (gsmData) => {

    var requestData = {
        networkName: gsmData.network_name,
        serviceDescription: gsmData.communication_protocol_description,
        alreadyImplemented: gsmData.already_implemented,
        logMonitoringEnabled: gsmData.log_monitoring_enabled,
        redundancyMeasures: gsmData.redundancy_measures,
        intrusionDetectionSystem: gsmData.intrusion_detection_system,
        lifetimeInYears: gsmData.firmware_integrity_check,
        dataPrivacyMeasures: { atRest: true, inTransit: true },
        securityAuditFrequencyInYears: gsmData.securityAuditFrequencyInYears,
        GsmNode: [],
        NetworkFailures: []

    }

    gsmData.gsmNodes.forEach(accessPoint => {

        const blNodeRequest = {

            supportedConnectionType: [],
            connectionTypeUtilized: '',
            gatewayIntermediateDevice: accessPoint.gateway_intermediate_device === 'No' ? false : true,
            deviceName: accessPoint.device_name,
            manufacturer: accessPoint.manufacturer,
            model: accessPoint.model,
            firmwareUpdatedYear: accessPoint.firmware_updated_year,
            ispProvider: accessPoint.ispProvider
        };

        accessPoint.standardsDataList.forEach(standard => {

            blNodeRequest.supportedConnectionType.push(MapSupportedConnectionTypes(standard.standar_name));

            if (standard.isDefault) {
                blNodeRequest.connectionTypeUtilized = MapSupportedConnectionTypes(standard.standar_name);
            }
        });

        requestData.GsmNode.push(blNodeRequest);
    });

    requestData.NetworkFailures = mapNetworkFailures(gsmData.network_failures);

    return requestData;

};

const MapSupportedConnectionTypes = (connectionType) => {

    switch (connectionType) {
        case "3G":
            return 'ThreeG'
        case "4G":
            return 'FourG'
        case "5G":
            return 'FiveG'
        default:
            return ''
    }
}

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


export default mapGsmApiData;