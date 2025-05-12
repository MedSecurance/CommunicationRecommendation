const loraWanApiData = (loraWanData) => {
    {
        var requestData = {
            networkName: loraWanData.network_name,
            communicationProtocolDescription: loraWanData.communication_protocol_description,
            alreadyImplemented: loraWanData.already_implemented,
            redundancyMeasures: loraWanData.redundancy_measures,
            intrusionDetectionSystem: loraWanData.intrusion_detection_system,
            firmwareIntegrityCheck: loraWanData.firmware_integrity_check,
            otherConnectedDevices: loraWanData.other_connected_devices,
            attacks: [],
            dataPrivacyMeasures: { atRest: loraWanData.at_rest, inTransit: loraWanData.in_transit },
            securityAuditFrequencyInYears: loraWanData.security_audit_frequency_in_years,
            riskAssessmentId: loraWanData.riskAssessmentId ?? null,
            riskAssessmentBody: JSON.stringify(loraWanData),
            networkDetails: {
                deploymentCountry: loraWanData.network_details.deployment_country,
                lifetimeInYears: loraWanData.network_details.lifetime_in_years,
                multicastEnable: loraWanData.network_details.multicast_enable,
                networkServer: {
                    name: loraWanData.network_details.network_server.name,
                    firewallEnable: loraWanData.network_details.network_server.firewall_enable,
                    logMonitoringEnable: loraWanData.network_details.network_server.log_monitoring_enable,
                    // deploymentType: loraWanData.network_details.network_server.deployment_type ? [loraWanData.network_details.network_server.deployment_type] : [],
                    bandwidthInMbps: loraWanData.network_details.network_server.bandwidth_in_Mbps,
                },
                applicationServer: {
                    name: loraWanData.network_details.application_server.name,
                    firewallEnable: loraWanData.network_details.application_server.firewall_enable,
                    // deploymentType: loraWanData.network_details.application_server.deployment_type ? [loraWanData.network_details.application_server.deployment_type] : [],
                    logMonitoringEnable: loraWanData.network_details.application_server.log_monitoring_enable,
                    bandwidthInMbps: loraWanData.network_details.application_server.bandwidth_in_Mbps,
                },
                gateways: []
            },
            NetworkFailures : []
        }

        loraWanData.network_details.gateways.forEach(gateway => {

            const gatewayRequest = {

                supportedFrequencyBands: [],
                frequencyBandUtilized: '',
                gatewayBackboneConnectionType: gateway.gateway_backbone_connection_type,
                gatewayName: gateway.gateway_name,
                manufacturer: gateway.manufacturer,
                model: gateway.model,
                bandwidthInMbps: gateway.bandwidth_in_Mbps,
                firmwareUpdatedYear: gateway.firmware_updated_year,
                physicalLocation: gateway.physical_location,
                adaptiveDataRate: gateway.adaptive_data_rate,
            };


            gateway.standardsDataList.forEach(standard => {

                gatewayRequest.supportedFrequencyBands.push(standard.standar_name);

                if (standard.isDefault) {
                    gatewayRequest.frequencyBandUtilized = standard.standar_name;
                }
            });

            requestData.networkDetails.gateways.push(gatewayRequest);
        });

        requestData.NetworkFailures = mapNetworkFailures(loraWanData.network_details.network_failures);

        return requestData;
    }

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


export default loraWanApiData;