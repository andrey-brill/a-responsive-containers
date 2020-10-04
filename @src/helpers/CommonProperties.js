
import { splitOnNumberAndSuffix } from './Utils';


export const PaddingRx = 42;
export const WindowPrefix = 'w';

export function commonProperties (prefix = '') {

    const properties = {

        x1: '1x',
        h100: '100h',
        w100: '100w',

        Padding: PaddingRx + 'x',

        H1: 63 + 'x',
        H2: 54 + 'x',
        H3: 46 + 'x',
        H4: 39 + 'x',
        H5: 33 + 'x',
        H6: 28 + 'x',

        T1: 24 + 'x',
        T2: 21 + 'x',
        T3: 19 + 'x'

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

