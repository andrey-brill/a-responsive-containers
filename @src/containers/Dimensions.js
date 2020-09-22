
import { isNumber } from "../helpers/Utils.js";
import { calcDiagonal, calcRx } from "./Rx.js";


export class Dimensions {

    constructor (width, height, inch) {

        if (!isNumber(inch) || inch <= 0.0) {
            throw new Error('Invalid inch: ' + inch);
        }

        if (!isNumber(width) || !isNumber(height)) {
            throw new Error('Invalid dimensions: ' + width + ', ' + height);
        }

        this.inch = inch;
        this.width = width;
        this.height = height;
        this.min = Math.min(width, height);
        this.max = Math.max(width, height);

        this.diagonal = calcDiagonal(width, height, inch);
        this.rx = calcRx(width, height, inch);
    }

    set rx (value) {

        if (!isNumber(value)) {
            throw new Error('Invalid value for rx: ' + value);
        }

        this._rx = value;
    }

    get rx () {
        return this._rx;
    }

}
