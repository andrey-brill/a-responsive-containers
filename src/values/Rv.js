
import { isFunction, isString, isNumber } from "../helpers/Utils.js";


/** Legend of RC-values
 *
 * All parts must be unique to simplify parsing
 *
 * Context:
 *     t = top container
 *     p = parent container
 *     c = current container
 *
 * Units:
 *     w = width
 *     h = height
 *     min = min(w,h)
 *     max = max(w,h)
 *     rx = relative pixel
 *     fx = fontSize-pixel
 *     lx = lineHeight-pixel
 *
 * Modifiers:
 *     R - round()
 *
 * */

const CONTEXTS = "c|p|t".split("|");
const UNITS = "rx|fx|lx|w|h|min|max".split("|");

const UNITS_NAMES = (() => {
    const names = {};
    for (let unit of UNITS) {
        names[unit] = unit;
    }
    return Object.assign(names, {
        w: "width",
        h: "height"
    });
})();

const ROUND = "R";
const MODIFIERS = [ROUND];

const DEFAULT_CONTEXT = CONTEXTS[0];
const DEFAULT_UNIT = UNITS[0];
const DEFAULT_SUFFIX = DEFAULT_CONTEXT + DEFAULT_UNIT;

const SUFFIX_PATTERN = new RegExp(`^(${CONTEXTS.join("|")})?(${UNITS.join("|")})${MODIFIERS.join("|")}?$`, "g");

export function rv (value, suffix = null) {

    if (value.isResponsiveObject || value.isResponsiveFunction) {
        return value;
    }

    if (isFunction(value)) {
        value.isResponsiveFunction = true;
        return value;
    }

    if (isString(value)) {
        let split = valueString.replace(/([0-9])(\D+)$/, "$1:$2").split(":"); // replace ..0x.. to ..0:x..
        value = split[0] * 1;
        suffix = split[1];
    } else if (isNumber(value) && !suffix) {
        suffix = DEFAULT_SUFFIX;
    }

    if (!value || !suffix || !isNumber(value) || !isString(suffix)) {
        throw new Error("Invalid syntax for responsive value: " + (value + suffix));
    }

    if (!SUFFIX_PATTERN.test(suffix)) {
        throw new Error("Invalid suffix for responsive value: " + suffix);
    }

    return {
        isResponsiveObject: true,
        value,
        context: firstStringInString(CONTEXTS, suffix, DEFAULT_CONTEXT),
        unit: UNITS_NAMES[firstStringInString(UNITS, suffix, DEFAULT_UNIT)],
        round: firstStringInString(MODIFIERS, suffix, "") == ROUND
    };
}

function firstStringInString (strings, str, notFoundStr) {

    for (let s in strings) {
        if (str.indexOf(s) > 0) {
            return str;
        }
    }

    return notFoundStr;
}
