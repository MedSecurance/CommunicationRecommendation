import {validateNumberInput} from '../validators-helpers/numbers-validators'

const wifiValidations = (wifiInputs) => {
    const newErrors = {};

    if (!wifiInputs.communication_protocol_description) {
        newErrors.communication_protocol_description = 'Protocol Description is required';
    }
    if (!wifiInputs.network_name) {
        newErrors.network_name = 'Network name is required';
    }
    if (!wifiInputs.use_case) {
        newErrors.use_case = 'Use case is required';
    }
    if (!wifiInputs.IP_range) {
        newErrors.IP_range = 'IP range is required';
    } else if (!isValidIPRange(wifiInputs.IP_range)) {
        newErrors.IP_range = 'Invalid IP range';
    }

    validateNumberInput(wifiInputs.ISP_connection_speed_in_Mpbs, 'ISP_connection_speed_in_Mpbs' , newErrors);
    validateNumberInput(wifiInputs.backbone_network_speed_in_Mpbs, 'backbone_network_speed_in_Mpbs' , newErrors);

    const networkDetails = wifiInputs.network_details;
    const deploymentDetails = networkDetails.deployment_details;

    validateNumberInput(networkDetails.other_connected_devices, 'other_connected_devices' , newErrors);

    if (!deploymentDetails.placement) {
        newErrors.placement = 'Placement is required';
    }
    if (!deploymentDetails.access_points.length) {
        newErrors.access_points = 'Access points are required';
    }

    validateNumberInput(deploymentDetails.lifetime_in_years, 'lifetime_in_years' , newErrors);

    return newErrors;
};

const isValidIPRange = (ipRange) => {
    // Regular expression to validate IP address with CIDR notation
    const ipRangePattern = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
    return ipRangePattern.test(ipRange);
};



export default wifiValidations;
