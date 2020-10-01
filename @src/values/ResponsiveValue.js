

import { resolveResponsiveValue } from '../core/K';
import { SuffixKeys } from '../helpers/SuffixKeys';
import { isNumber, isString } from '../helpers/Utils';


/** Legend of values
 *
 * All keys must be unique to simplify parsing
 *
 * Units:
 *     x = (1 / Context.FullHeight) % of height
 *     w = % of width
 *     h = % of height
 *     m = % of min(width, height)
 *     M = % of max(width, height)
 *
 * Contexts:
 *    r = responsive (see resolveResponsiveK)
 *    u = uniform (1-1)
 *
 * Modifiers:
 *     R = round
 *
 * */


const Units = new SuffixKeys([ 'x', 'w', 'h', 'm', 'M']);
const Contexts = new SuffixKeys([ 'r', 'u' ]);
const Round = new SuffixKeys([ 'R' ]);

const SuffixRegEx = SuffixKeys.buildSuffixRegEx(Contexts, Units, Round);


export class ResponsiveValue {

    constructor (value, suffix = '') {

        if (!value || !isNumber(value) || !isString(suffix)) {
            throw new Error("Invalid syntax for responsive value: " + (value + suffix));
        }

        if (!SuffixRegEx.test(suffix)) {
            throw new Error("Invalid suffix for responsive value: " + suffix);
        }

        this.value = value;
        this.context = Contexts.resolve(suffix) || 'r';
        this.unit = Units.resolve(suffix) || 'x';
        this.round = Round.containsIn(suffix);

    }

    calc ({ kW, kH }) {
        const v = resolveResponsiveValue(this.value, this.unit, kW, kH);
        return this.round ? Math.max(1,Math.round(v)) : v; // safe rounding
    }

}