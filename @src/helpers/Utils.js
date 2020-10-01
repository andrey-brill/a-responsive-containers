

export function isFunction (obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

export function isString (obj) {
    return typeof obj === "string" || obj instanceof String;
}

export function isNumber (obj) {
    return (obj * 1 === obj) && !isNaN(obj) && isFinite(obj);
}

export function splitOnNumberAndSuffix (value) {
    if (isString(value)) {
        const split = value.replace(/([0-9])(\D+)$/, "$1:$2").split(":"); // replace ..0x.. to ..0:x..
        return {
            number: split[0] * 1,
            suffix: split[1]
        }
    } else {
        throw Error('Value is not string: ' + value);
    }
}

// in browsers 1in == 96px, but real size in pixels, especially on mobiles is usually larger in 1.4
export function fromPhysicalInchToWebInch (physicalInch) {
    return physicalInch * 1.4;
}