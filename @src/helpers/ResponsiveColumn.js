
import { fromInch } from '../core/Context';
import { fromPhysicalInchToWebInch } from './Utils';


const ColumnRatio = 9.0 / 16.0;
const MinColumnWidthInch = fromPhysicalInchToWebInch(3.5);

// Resolving sizes of virtual column inside full-height sections of landing pages
// Do not use this in web-applications (there height must be non-changeable)
export function toResponsiveColumn (width, height, maxNumberOfColumns = 2) {

    if (width <= 0 || height <= 0 || maxNumberOfColumns <= 0) {
        throw Error('Invalid arguments');
    }

    const minColumnWidth = fromInch(MinColumnWidthInch);

    let numberOfColumns = maxNumberOfColumns;
    while (numberOfColumns > 1 && width < numberOfColumns * minColumnWidth) {
        numberOfColumns--;
    }

    const hColumnWidth = height * ColumnRatio;
    const wColumnWidth = width / numberOfColumns;
    const realColumnWidth = Math.min(wColumnWidth, hColumnWidth);

    if (numberOfColumns === 1) {
        const rHeight = width / ColumnRatio;
        return {
            width,
            height: width <= height ? Math.min(height, rHeight) : rHeight, // horizontal mode is "zooming" mode
            numberOfColumns: 1
        };
    } else { // big screen
        return {
            width: realColumnWidth,
            height: realColumnWidth / ColumnRatio,
            numberOfColumns
        };
    }

}
