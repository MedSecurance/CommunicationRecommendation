function isPositiveNumber(str) {
    // Check if the string is a number and is greater than zero
    return !isNaN(str) && parseFloat(str) > 0;
}

export const validateNumberInput = (inputFieldValue , inputFieldName , errorsArray) => { 

    if (!inputFieldValue) {
        errorsArray[inputFieldName] = inputFieldName + " is required";
    }else if (!isPositiveNumber(inputFieldValue))
    {
        errorsArray[inputFieldName] = inputFieldName + " must be a positive number";
    }
}
