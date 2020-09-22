
import { isFunction, isString, isNumber } from "../helpers/Utils.js";
import { Suffixes } from "../helpers/Suffixes.js";
import { assignMath } from "./Math.js";


/** Legend of RC-values
 *
 * All suffixes must be unique to simplify parsing
 *
 * Context:
 *     t = top container
 *     p = parent container
 *     c = current container
 *
 * Units:
 *     x = responsive pixel
 *     w = width
 *     h = height
 *     d = diagonal
 *     m = min(width, height)
 *     M = max(width, height)
 *
 * Modifiers:
 *     R = round
 *
 * */

const CONTEXTS = new Suffixes('current', {
    c: 'current',
    p: 'parent',
    t: 'top'
});

const DEFAULT_UNIT = 'x';

const UNITS = new Suffixes('rx', {
    x: 'rx',
    d: 'diagonal',
    w: 'width',
    h: 'height',
    m: 'min',
    M: 'max'
});

const MODIFIERS = new Suffixes(undefined, {
    R: 'round'
});

const SUFFIX_REG_EX = Suffixes.buildSuffixRegEx(CONTEXTS, UNITS, MODIFIERS);

function rv (value, suffix = null) {

    if (value == null) {
        throw new Error('Value is undefined')
    }

    if (value.isResponsiveObject || value.isResponsiveFunction) {
        return value;
    }

    if (isFunction(value)) {
        value.isResponsiveFunction = true;
        return value;
    }

    if (isString(value)) {
        let split = value.replace(/([0-9])(\D+)$/, "$1:$2").split(":"); // replace ..0x.. to ..0:x..
        value = split[0] * 1;
        suffix = split[1];
    }

    if (!suffix || suffix.trim() === '') {
        suffix = DEFAULT_UNIT;
    }

    if (!value || !suffix || !isNumber(value) || !isString(suffix)) {
        throw new Error("Invalid syntax for responsive value: " + (value + suffix));
    }

    if (!SUFFIX_REG_EX.test(suffix)) {
        throw new Error("Invalid suffix for responsive value: " + suffix);
    }

    const result = {
        isResponsiveObject: true,
        value,
        context: CONTEXTS.resolve(suffix),
        unit: UNITS.resolve(suffix),
    };

    MODIFIERS.resolveSeparately(result, suffix);

    if (!result.context || !result.unit) {
        throw new Error('Invalid responsive value: ' + (value + suffix));
    }

    return result;
}

assignMath(rv);

export { rv };