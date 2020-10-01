
import { isFunction, isString, splitOnNumberAndSuffix } from "../helpers/Utils.js";
import { ResponsiveValue } from './ResponsiveValue.js';

function rv (value, suffix = null) {

    if (value == null) {
        throw new Error('Value is undefined')
    }

    if (value instanceof ResponsiveValue) {
        return value;
    }

    if (isFunction(value)) {
        return value;
    }

    if (isString(value)) {
        const split = splitOnNumberAndSuffix(value);
        value = split.number;
        suffix = split.suffix;
    }

    return new ResponsiveValue(value, suffix);
}

export { rv };