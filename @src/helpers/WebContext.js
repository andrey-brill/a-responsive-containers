
import { initializeContext } from '../core/Context';
import { fromPhysicalInchToWebInch } from './Utils';


// By default expecting mobile grid
// 960 - contains max number of primitive dividers

const
    MobileUniformHeightInch = 5, // Average height of new smartphones in 2020 is 5"
    GridAspectRatio = 9 / 16,
    GridHeight = 960,
    GridWidth = GridHeight * GridAspectRatio,
    DesignHeightInch = fromPhysicalInchToWebInch(MobileUniformHeightInch),
    DesignWidthInch = DesignHeightInch * GridAspectRatio,
    InchSize = 96, // standard for browsers
    ResponsiveK = Math.PI / 10; // magic responsive adjustment

export function initializeWebContext(options = {}) {
    initializeContext(Object.assign({
        inchSize: InchSize,
        responsiveK: ResponsiveK,
        designHeightInch: DesignHeightInch,
        designWidthInch: DesignWidthInch,
        gridWidth: GridWidth,
        gridHeight: GridHeight
    }, options))
}
