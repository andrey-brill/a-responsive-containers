

export function isFunction (obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

export function isString (obj) {
    return typeof obj === "string" || obj instanceof String;
}

export function isNumber (obj) {
    return (obj * 1 === obj) && !isNaN(obj) && isFinite(obj);
}
