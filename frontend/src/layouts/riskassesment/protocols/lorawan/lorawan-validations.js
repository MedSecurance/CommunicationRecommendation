import {validateNumberInput} from '../validators-helpers/numbers-validators'

const loraWanValidations = (loraWanInputs) => {
    const newErrors = {};

    if (!loraWanInputs.communication_protocol_description) {
        newErrors.communication_protocol_description = 'Protocol Description is required';
    }
    if (!loraWanInputs.network_name) {
        newErrors.network_name = 'Network name is required';
    }

    validateNumberInput(loraWanInputs.security_audit_frequency_in_years, 'security_audit_frequency_in_years' , newErrors);
    validateNumberInput(loraWanInputs.other_connected_devices, 'other_connected_devices' , newErrors);

    const networkDetails = loraWanInputs.network_details;

    if (!networkDetails.deployment_country) {
        newErrors.deployment_country = 'Deployment country required';
    }
    if (!networkDetails.gateways.length) {
        newErrors.gateways = 'Gateways are required';
    }

    validateNumberInput(networkDetails.lifetime_in_years, 'lifetime_in_years' , newErrors);

    const networkServer = loraWanInputs.network_details.network_server;
   
    if (!networkServer.name) {
        newErrors.networkServerName = 'Network server name is required';
    }

    if (!networkServer.deployment_type) {
        newErrors.networkServerDeploymentType = 'Deployment type is required';
    }

    validateNumberInput(networkServer.bandwidth_in_Mbps, 'bandwidth_in_Mbps' , newErrors);

    const applicationServer = loraWanInputs.network_details.application_server;
   
    if (!applicationServer.name) {
        newErrors.applicationServerName = 'Network server name is required';
    }

    if (!applicationServer.deployment_type) {
        newErrors.applicationServerDeploymentType = 'Deployment type is required';
    }

    validateNumberInput(applicationServer.bandwidth_in_Mbps, 'bandwidth_in_Mbps' , newErrors);


    return newErrors;
};



export default loraWanValidations;
