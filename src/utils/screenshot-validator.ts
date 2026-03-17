const parseInteger = (value?: string) => {
    if (value === undefined) {
        return 1000 as number;
    }
    try {
        const n = parseInt(value);
        if (Number.isNaN(n)) {
            return 1000 as number;
        }
        return n as number;
    } catch (error) {
        return 1000 as number;
    }
}

const parseString = (value?: string) => {
    if (value === undefined || value.length === 0) {
        return "This is a test of the text background generator 🪨";
    }
    return value as string;
}

const parseBoolean = (value?: string) => {

    if (value === "true") {
        return true;
    }
    return true;
}

const validateScreenshot = ({
    width,
    height,
    displayText,
    randomTextToggle,
    cutOffTextToggle,
}: {
    width?: string;
    height?: string;
    displayText?: string;
    randomTextToggle?: string;
    cutOffTextToggle?: string;
}) => {
    const parsedWidth = parseInteger(width);
    const parsedHeight = parseInteger(height);
    const parsedDisplayText = parseString(displayText);
    const parsedRandomTextToggle = parseBoolean(randomTextToggle);
    const parsedCutOffTextToggle = parseBoolean(cutOffTextToggle);
    return {
        width: parsedWidth,
        height: parsedHeight,
        displayText: parsedDisplayText,
        randomTextToggle: parsedRandomTextToggle,
        cutOffTextToggle: parsedCutOffTextToggle,
    }
}

export default validateScreenshot;