import {validateNumberInput} from '../../../riskassesment/protocols/validators-helpers/numbers-validators'
import {validateMacAddress} from '../../../riskassesment/protocols/validators-helpers/input-validators'

const ValidateProtocolsInputs = (errors, formData) => {

    if (formData.supportedCommunicationProtocols?.includes('WiFi') && formData.wifiSpecs) {
        const wifiSpecsErrors = {};
       
        if (!formData.wifiSpecs.ipAddress) wifiSpecsErrors.ipAddress = 'IpAddress is required';
        if (!formData.wifiSpecs.frequencyUtilized) wifiSpecsErrors.frequencyUtilized = 'Frequency Utilized is required';
        if (!formData.wifiSpecs.standardUtilized) wifiSpecsErrors.standardUtilized = 'Standard Utilized is required';
        if (!formData.wifiSpecs.encryption) wifiSpecsErrors.encryption = 'Encryption is required';
        if (!formData.wifiSpecs.firmware) wifiSpecsErrors.firmware = 'Firmware is required';
        if (formData.wifiSpecs.supportedStandards.length == 0) wifiSpecsErrors.supportedStandards = 'Supported Standards are required';
        if (formData.wifiSpecs.supportedFrequencies.length == 0) wifiSpecsErrors.supportedFrequencies = 'Supported Frequencies are required';

        validateMacAddress(formData.wifiSpecs.macAddress, 'macAddress' , wifiSpecsErrors);
        
        if (Object.keys(wifiSpecsErrors).length > 0) {
            errors.wifiSpecs = wifiSpecsErrors;
        }

    }

    if (formData.supportedCommunicationProtocols?.includes('Bluetooth') && formData.bluetoothSpecs) {
        const bluetoothSpecsErrors = {};
       
        if (!formData.bluetoothSpecs.utilizedVersion) bluetoothSpecsErrors.utilizedVersion = 'Utilized version is required';
        if (!formData.bluetoothSpecs.macAddress) bluetoothSpecsErrors.macAddress = 'Mac Address is required';
        if (!formData.bluetoothSpecs.firmware) bluetoothSpecsErrors.firmware = 'Firmware is required';
        if (formData.bluetoothSpecs.supportedAntenas.length == 0) bluetoothSpecsErrors.supportedAntenas = 'Supported Antenas are required';
        if (formData.bluetoothSpecs.supportedAuthenticationMethods.length == 0) bluetoothSpecsErrors.supportedAuthenticationMethods = 'Supported Authentication Methods are required';
        if (formData.bluetoothSpecs.supportedDataIntegrities.length == 0) bluetoothSpecsErrors.supportedDataIntegrities = 'Supported Data Integrities are required';
        if (formData.bluetoothSpecs.supportedTopologies.length == 0) bluetoothSpecsErrors.supportedTopologies = 'Supported Topologies are required';
        if (formData.bluetoothSpecs.supportedAccessControlMechanisms.length == 0) bluetoothSpecsErrors.supportedAccessControlMechanisms = 'Supported AccessControl Mechanisms Topologies are required';
        if (formData.bluetoothSpecs.supportedVersions.length == 0) bluetoothSpecsErrors.supportedVersions = 'Supported Versions are required';

        validateMacAddress(formData.bluetoothSpecs.macAddress, 'macAddress' , bluetoothSpecsErrors);

        if (Object.keys(bluetoothSpecsErrors).length > 0) {
            errors.bluetoothSpecs = bluetoothSpecsErrors;
        }
    }

    if (formData.supportedCommunicationProtocols?.includes('GSM') && formData.gsmSpecs) {
        const gsmSpecsErrors = {};
        
        if (!formData.gsmSpecs.firmware) gsmSpecsErrors.firmware = 'Firmware is required';
        if (formData.gsmSpecs.supportedGenerations.length == 0) gsmSpecsErrors.supportedGenerations = 'Supported Generations are required';
        
        validateMacAddress(formData.gsmSpecs.macAddress, 'macAddress' , gsmSpecsErrors);

        if (Object.keys(gsmSpecsErrors).length > 0) {
            errors.gsmSpecs = gsmSpecsErrors;
        }
    }

    if (formData.supportedCommunicationProtocols?.includes('LoraWan') && formData.lorawanSpecs) {
        const lorawanSpecsErrors = {};
       
        if (!formData.lorawanSpecs.macAddress) lorawanSpecsErrors.macAddress = 'Mac Address is required';
        if (!formData.lorawanSpecs.firmware) lorawanSpecsErrors.firmware = 'Firmware is required';
        if (formData.lorawanSpecs.supportedFrequencyBands.length == 0) lorawanSpecsErrors.supportedFrequencyBands = 'Supported Frequency Bands are required';
        if (!formData.lorawanSpecs.utilizedFrequencyBand) lorawanSpecsErrors.utilizedFrequencyBand = 'Utilized Frequency Band is required';
        if (!formData.lorawanSpecs.physicalLocation) lorawanSpecsErrors.physicalLocation = 'Physical Location is required';
        if (!formData.lorawanSpecs.joinMode) lorawanSpecsErrors.joinMode = 'Join Mode is required';


        validateMacAddress(formData.lorawanSpecs.macAddress, 'macAddress' , lorawanSpecsErrors);

        if (Object.keys(lorawanSpecsErrors).length > 0) {
            errors.lorawanSpecs = lorawanSpecsErrors;
        }
    }
}

const BluetoothUtilized = (bluetoothSpecs) => {
    if (bluetoothSpecs?.supportedAntenas?.length > 0) {
        bluetoothSpecs.utilizedAntena = bluetoothSpecs.supportedAntenas[0];
    }
    if (bluetoothSpecs?.supportedAuthenticationMethods?.length > 0) {
        bluetoothSpecs.utilizedAuthenticationMethod = bluetoothSpecs.supportedAuthenticationMethods[0];
    }
    if (bluetoothSpecs?.supportedDataIntegrities?.length > 0) {
        bluetoothSpecs.utilizedDataIntegrity = bluetoothSpecs.supportedDataIntegrities[0];
    }
    if (bluetoothSpecs?.supportedTopologies?.length > 0) {
        bluetoothSpecs.utilizedTopology = bluetoothSpecs.supportedTopologies[0];
    }
    if (bluetoothSpecs?.supportedAccessControlMechanisms?.length > 0) {
        bluetoothSpecs.utilizedAccessControlMechanism = bluetoothSpecs.supportedAccessControlMechanisms[0];
    }
}

const SetDefaults = (formData) => {
    if (!formData.supportedCommunicationProtocols.includes('GSM')) {
        formData.gsmSpecs = null;
    }

    if (!formData.supportedCommunicationProtocols.includes('WiFi')) {
        formData.wifiSpecs = null;
    }

    if (!formData.supportedCommunicationProtocols.includes('Bluetooth')) {
        formData.bluetoothSpecs = null;
    }

    if (!formData.supportedCommunicationProtocols.includes('LoraWan')) {
        formData.lorawanSpecs = null;
    }
}

export const ValidateFromData = (formData) => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.serialNumber) newErrors.serialNumber = 'Serial Number is required';
    if (!formData.manufacturer) newErrors.manufacturer = 'Manufacturer is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.type) newErrors.type = 'Type is required';
    
    if (!formData.communicationProtocol || formData.supportedCommunicationProtocols.length === 0)
    { 
        newErrors.communicationProtocol = 'Communication Protocol is required';
    }
    if (!formData.networkName) newErrors.networkName = 'Network Name is required';
    if (!formData.doctorId) newErrors.doctorId = 'Doctor Id is required';
    if (!formData.location) newErrors.location = 'Location is required';

    ValidateProtocolsInputs(newErrors, formData);

    return newErrors;

}

export const SetProtocolsData = (formData) => {

    BluetoothUtilized(formData.bluetoothSpecs);
    SetDefaults(formData);
}

