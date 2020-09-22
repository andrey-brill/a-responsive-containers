

export const PADDING_RX = 6;

const GLOBAL_PREFIX = 'g';

export function commonProperties (customProperties = {}, prefix = GLOBAL_PREFIX) {
    const properties = commonRxProperties(customProperties, prefix);
    return commonContainerProperties(properties, prefix);
}

export function commonContainerProperties (customProperties = {}, prefix = GLOBAL_PREFIX) {

    const properties = {};

    for (let i = 1; i <= 100; i++) {

        properties[i + 'cw'] = i + 'cw';
        properties[i + 'ch'] = i + 'ch';

        properties[i + 'pw'] = i + 'pw';
        properties[i + 'ph'] = i + 'ph';

        properties[i + 'tw'] = i + 'tw';
        properties[i + 'th'] = i + 'th';
    }

    const prefixed = addPrefix(properties, prefix);

    return Object.assign(prefixed, customProperties);
}

export function commonRxProperties (customProperties = {}, prefix = GLOBAL_PREFIX) {

    const properties = {

        '0d1': 0.1,
        '0d2': 0.2,
        '0d3': 0.3,
        '0d4': 0.4,
        '0d5': 0.5,

        Padding: PADDING_RX,
        Padding2x: 2 * PADDING_RX,

        Small: '2.75R',
        Text: '3.15R',
        H6: '3.5R',
        H5: '4.25R',
        H4: '5.0R',
        H3: '5.75R',
        H2: '7R',
        H1: '8.5R'
    };

    for (let i = 1; i <= 20; i++) {
        properties[i] = i;
        properties[i + 'd5'] = i + 0.5;
    }

    const prefixed = addPrefix(properties, prefix);

    return Object.assign(prefixed, customProperties);
}

function addPrefix (properties, prefix) {

    const result = {};
    for (let key in properties) {
        result[(key == 'onResize' ? '': prefix) + key] = properties[key];
    }

    return result;
}
