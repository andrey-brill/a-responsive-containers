
import { FontMultipliers } from "./FontMultipliers.js";


const UNIT_MULTIPLIERS = {
    rx: 1.0,
    width: 0.01,
    height: 0.01,
    min: 0.01,
    max: 0.01
};

export function resolveUnitsMultipliers (fontMultipliers = FontMultipliers.default) {
    const m = Object.assign({}, fontMultipliers);
    return Object.assign(m, UNIT_MULTIPLIERS);
}
