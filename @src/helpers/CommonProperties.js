
import { isNumber, splitOnNumberAndSuffix } from './Utils';


export const PaddingRx = 42;
export const WindowPrefix = 'w';

export function commonProperties (prefix = '') {

    const
        TextK = 1.1991,

        T1 = 24,
        T2 = Math.round(T1 / TextK),
        T3 = Math.round(T2 / TextK),

        H6 = Math.round(T1 * TextK),
        H5 = Math.round(H6 * TextK),
        H4 = Math.round(H5 * TextK),
        H3 = Math.round(H4 * TextK),
        H2 = Math.round(H3 * TextK),
        H1 = Math.round(H2 * TextK);


    const properties = {

        x1: '1x',
        h100: '100h',
        w100: '100w',

        Padding: PaddingRx,

        H1, H2, H3, H4, H5, H6,
        T1, T2, T3

    };

    const ru = {}

    for (let c of ['r', 'u']) {
        for (let key in properties) {

            let value = properties[key];
            if (isNumber(value)) {
                value = value + 'x';
            }

            const { number, suffix } = splitOnNumberAndSuffix(value)
            ru[prefix + c + key] = '' + number + c + suffix; // h1 = 1h => rh1 = 1rh
        }
    }

    return ru;
}

