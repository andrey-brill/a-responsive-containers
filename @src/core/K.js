

import { context } from './Context';


const ResponsiveK = 0.25;

export function resolveResponsiveK (height, gridHeight) {
    const { gridHeight : contextHeight, inchSize, designHeightInch } = context();
    const fullHeightInch = height * contextHeight / (gridHeight * inchSize);
    return fullHeightInch <= designHeightInch ? 1 : ResponsiveK;
}

export function resolveKW (width, gridWidth, responsiveK) {
    const { gridWidth : contextWidth, designWidthInch, inchSize } = context();
    const expectedWidth = (gridWidth / contextWidth) * designWidthInch * inchSize;
    if (expectedWidth <= width) {
        return expectedWidth / width;
    } else {
        return (width + (expectedWidth - width) * responsiveK) / width;
    }
}

export function resolveKH (height, gridHeight, responsiveK) {
    const { gridHeight : contextHeight, designHeightInch, inchSize } = context();
    const expectedHeight = (gridHeight / contextHeight) * designHeightInch * inchSize;
    if (expectedHeight <= height) {
        return expectedHeight / height;
    } else {
        return (height + (expectedHeight - height) * responsiveK) / height;
    }
}

export function resolveResponsiveValue (value, unit, kW, kH) {

    const { responsiveMultiplier, gridWidth, gridHeight } = context()

    const multiplier = unit === 'x' ? responsiveMultiplier : 0.01;

    const vh = kH * value * multiplier * gridHeight;
    const vw = kW * value * multiplier * gridWidth;

    switch (unit) {
        case 'x':
            return vh;
        case 'h':
            return vh;
        case 'w':
            return vw;
        case 'm':
            return Math.min(vw, vh);
        case 'M':
            return Math.max(vw, vh);
    }

    throw Error('Unknown unit: ' + unit);
}