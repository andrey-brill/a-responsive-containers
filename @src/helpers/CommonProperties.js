
import { splitOnNumberAndSuffix } from './Utils';


export const PaddingRx = 16;

export function commonProperties (prefix = '') {

    const properties = {

        h1: '1h',
        h100: '100h',

        w1: '1w',
        w100: '100w',

        m1: '1m',
        m100: '100m',

        M1: '1M',
        M100: '100M',

        Padding: PaddingRx + 'x',
        Padding2x: (2 * PaddingRx) + 'x',

        Text: 12 + 'x'
    };

    const ru = {}

    for (let c of ['r', 'u']) {
        for (let key in properties) {
            const { number, suffix } = splitOnNumberAndSuffix(properties[key])
            ru[prefix + c + key] = '' + number + c + suffix; // h1 = 1h => rh1 = 1rh
        }
    }

    return ru;
}

