const formatLabel = (label) => {
    // Split the label at each uppercase letter and join with a space
    return label.replace(/([A-Z])/g, ' $1')
                // Trim any leading space caused by the first character being uppercase
                .trim()
                // Capitalize the first letter of the result
                .replace(/^./, (str) => str.toUpperCase());
  };

  export default formatLabel;