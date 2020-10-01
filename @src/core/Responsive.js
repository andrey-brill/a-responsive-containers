

import { context } from './Context';


export function responsiveK (height, gridHeight) {
    const { gridHeight : contextHeight, inchSize, designHeightInch, responsiveK } = context();
    const fullHeightInch = (height / inchSize) * (contextHeight / gridHeight);
    return fullHeightInch <= designHeightInch ? 1 : responsiveK;
}

export function responsiveWidth (width, gridWidth, responsiveK) {
    const { gridWidth : contextWidth, designWidthInch, inchSize } = context();
    const expectedWidth = (gridWidth / contextWidth) * designWidthInch * inchSize;
    if (width <= expectedWidth) {
        return width;
    } else {
        return expectedWidth + (width - expectedWidth) * responsiveK;
    }
}

export function responsiveHeight (height, gridHeight, responsiveK) {
    const { gridHeight : contextHeight, designHeightInch, inchSize } = context();
    const expectedHeight = (gridHeight / contextHeight) * designHeightInch * inchSize;

    if (height <= expectedHeight) {
        return height;
    } else {
        return expectedHeight + (height - expectedHeight) * responsiveK;
    }
}

export function resolveResponsiveValue (value, unit, responsiveWidth, responsiveHeight) {

    switch (unit) {
        case 'x':
            const { responsiveMultiplier } = context()
            return value * responsiveMultiplier * responsiveHeight;
        case 'h':
            return value * 0.01 * responsiveHeight;
        case 'w':
            return value * 0.01 * responsiveWidth;
    }

    throw Error('Unknown unit: ' + unit);
}