
import {validateNumberInput} from '../validators-helpers/numbers-validators'

const gsmValidations = (gsmInputs) => {
    const newErrors = {};

    if (!gsmInputs.communication_protocol_description) {
        newErrors.communication_protocol_description = 'Protocol Description is required';
    }
    if (!gsmInputs.network_name) {
        newErrors.network_name = 'Network name is required';
    }
    
    validateNumberInput(gsmInputs.security_audit_frequency_in_years, 'security_audit_frequency_in_years' , newErrors);

    return newErrors;
};

export default gsmValidations;
