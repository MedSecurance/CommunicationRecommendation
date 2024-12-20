import {validateNumberInput} from '../validators-helpers/numbers-validators'

const bluetoothValidations = (bluetoothInputs) => {
    const newErrors = {};

    if (!bluetoothInputs.communication_protocol_description) {
        newErrors.communication_protocol_description = 'Protocol Description is required';
    }
    if (!bluetoothInputs.mesh_name) {
        newErrors.mesh_name = 'Mesh name is required';
    }
    
    validateNumberInput(bluetoothInputs.maximum_supported_devices, 'maximum_supported_devices' , newErrors);
    validateNumberInput(bluetoothInputs.security_audit_frequency_in_years, 'security_audit_frequency_in_years' , newErrors);

    if (!bluetoothInputs.access_control_mechanism) {
        newErrors.access_control_mechanism = 'Access control mechanism is required';
    }

    validateNumberInput(bluetoothInputs.backbone_network_speed_in_mpbs, 'backbone_network_speed_in_mpbs' , newErrors);

    const meshDetails = bluetoothInputs.mesh_details;
    const deploymentDetails = meshDetails.deployment_details;

    if (!deploymentDetails.topology_type) {
        newErrors.topology_type = 'Topology type is required';
    }
    if (!deploymentDetails.access_points.length) {
        newErrors.access_points = 'Access points are required';
    }

    validateNumberInput(deploymentDetails.area_coverage_in_meters, 'area_coverage_in_meters' , newErrors);
    validateNumberInput(deploymentDetails.typical_latency_in_ms, 'typical_latency_in_ms' , newErrors);
    validateNumberInput(deploymentDetails.bandwidth_in_mbps, 'bandwidth_in_mbps' , newErrors);
    validateNumberInput(deploymentDetails.lifetime_in_years, 'lifetime_in_years' , newErrors);

    if (!deploymentDetails.level_of_interference) {
        newErrors.level_of_interference = 'Level of interference is required';
    }

    return newErrors;
};


export default bluetoothValidations;
