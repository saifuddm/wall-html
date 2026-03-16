// Validators
const parseInteger = (key: string, value: string) => {
    const n = parseInt(value);
    if (Number.isNaN(n)) {
        throw new Error(`Invalid integer: ${key}: ${value}`);
    }
    return n as number;
}

const parseBoolean = (key: string, value: string) => {
    if (value === "true") {
        return true;
    }
    if (value === "false") {
        return false;
    }
    throw new Error(`Invalid boolean: ${key}: ${value}`);
}

const parseString = (key: string, value: string) => {
    if (value.length === 0) {
        throw new Error(`Invalid string: ${key}: ${value}`);
    }
    return value as string;
}

const validateRoute = ({
    cpl,
    lpp,
    displayText,
    randomTextToggle
}: { cpl: string, lpp: string, displayText: string, randomTextToggle: string }) => {
    const parsedCpl = parseInteger("cpl", cpl);
    const parsedLpp = parseInteger("lpp", lpp);
    const parsedDisplayText = parseString("displayText", displayText);
    const parsedRandomTextToggle = parseBoolean("randomTextToggle", randomTextToggle);
    return {
        cpl: parsedCpl,
        lpp: parsedLpp,
        displayText: parsedDisplayText,
        randomTextToggle: parsedRandomTextToggle
    }
}

const isEmoji = (ch: string) => /\p{Extended_Pictographic}/u.test(ch);

// Calculators
const fontSizePx = 128
const avgGlyphWidth = fontSizePx * 0.6;

const calculateCpl = (width: number) => {
    const cpl = Math.floor(width / avgGlyphWidth);
    console.log(`cpl: ${cpl}`);
    return cpl;
}

const calculateLpp = (height: number) => {
    const lpp = Math.floor(height / fontSizePx);
    console.log(`lpp: ${lpp}`);
    return lpp;
};

export { validateRoute, calculateCpl, calculateLpp, isEmoji };