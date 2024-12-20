import {validateNumberInput} from '../../../riskassesment/protocols/validators-helpers/numbers-validators'

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

        validateNumberInput(formData.wifiSpecs.bandwidth, 'bandwidth' , wifiSpecsErrors);
       
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

        validateNumberInput(formData.bluetoothSpecs.bandwidth, 'bandwidth' , bluetoothSpecsErrors);

        if (Object.keys(bluetoothSpecsErrors).length > 0) {
            errors.bluetoothSpecs = bluetoothSpecsErrors;
        }
    }

    if (formData.supportedCommunicationProtocols?.includes('GSM') && formData.gsmSpecs) {
        const gsmSpecsErrors = {};
        
        if (!formData.gsmSpecs.firmware) gsmSpecsErrors.firmware = 'Firmware is required';
        if (formData.gsmSpecs.supportedGenerations.length == 0) gsmSpecsErrors.supportedGenerations = 'Supported Generations are required';

        if (Object.keys(gsmSpecsErrors).length > 0) {
            errors.gsmSpecs = gsmSpecsErrors;
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

const GsmStandartUtilized = (gsmSpecs) => {
    if (gsmSpecs?.supportedGenerations?.length > 0) {
        gsmSpecs.utilizedGeneration = gsmSpecs.supportedGenerations[0];
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
    if (!formData.networkIdentifier) newErrors.networkIdentifier = 'Network Identifier is required';
    if (!formData.doctorId) newErrors.doctorId = 'Doctor Id is required';
    if (!formData.location) newErrors.location = 'Location is required';

    ValidateProtocolsInputs(newErrors, formData);

    return newErrors;

}

export const SetProtocolsData = (formData) => {

    BluetoothUtilized(formData.bluetoothSpecs);
    GsmStandartUtilized(formData.gsmSpecs);
    SetDefaults(formData);
}

