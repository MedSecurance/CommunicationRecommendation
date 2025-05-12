export const useFormHandlers = (setFormData) => {
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        const propertyNames = name.split('.');

        setFormData(prevState => {
            const updatedState = { ...prevState };
            let currentLevel = updatedState;

            // Traverse through all levels except the last one
            for (let i = 0; i < propertyNames.length - 1; i++) {
                const propertyName = propertyNames[i];
                currentLevel[propertyName] = { ...currentLevel[propertyName] } || {};
                currentLevel = currentLevel[propertyName];
            }

            // Set the value at the final level
            const finalProperty = propertyNames[propertyNames.length - 1];
            currentLevel[finalProperty] = checked;

            return updatedState;
        });
    };

    return { handleCheckboxChange };
};