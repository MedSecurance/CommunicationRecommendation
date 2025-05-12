
import {validateNumberInput} from '../validators-helpers/numbers-validators'

const gsmValidations = (gsmInputs) => {
    const newErrors = {};

    if (!gsmInputs.communication_protocol_description) {
        newErrors.communication_protocol_description = 'Protocol Description is required';
    }
    if (!gsmInputs.network_name) {
        newErrors.network_name = 'Network name is required';
    }
    
    validateNumberInput(gsmInputs.securityAuditFrequencyInYears, 'securityAuditFrequencyInYears' , newErrors);
    validateNumberInput(gsmInputs.lifetime_in_years, 'lifetime_in_years' , newErrors);    

    return newErrors;
};

export default gsmValidations;
