const isValidMacAddress = (macAddress) => {
    const macRegex = /^(?:[0-9A-Fa-f]{2}:){5}(?:[0-9A-Fa-f]{2})$/;
    return macRegex.test(macAddress);
};

export const validateMacAddress = (inputFieldValue , inputFieldName , errorsArray) => { 

    if (!inputFieldValue) {
        errorsArray[inputFieldName] = inputFieldName + " is required";
    }else if (!isValidMacAddress(inputFieldValue))
    {
        errorsArray[inputFieldName] = inputFieldName + " must be a valid Mac Address format of 6 2-digit hexadecimal numbers form 00 to ff, i.e., 00:11:22:dd:ee:ff";
    }
}