
import { isFunction } from "../helpers/Utils.js";
import { responsiveHeight, responsiveWidth, responsiveK } from './Responsive.js';
import { context } from '../core/Context.js';


export class Container {

    constructor (options = {}) {

        const { gridWidth: contextWidth, gridHeight: contextHeight } = context()
        this.gridWidth = options.gridWidth || contextWidth;
        this.gridHeight = options.gridHeight || contextHeight;

        this.isValid = options.isValid

        this.gridAspectRatio = this.gridWidth / this.gridHeight;

        if (!this.gridWidth || !this.gridHeight) {
            throw Error('Grid width or height is undefined: (' + options.gridWidth + ', ' + options.gridHeight + ')')
        }

        this.width = 0;
        this.height = 0;

        this.ru = {
            r: { responsiveWidth: 0, responsiveHeight: 0 },
            u: { responsiveWidth: 0, responsiveHeight: 0 }
        }
    }

    resize (width, height) {

        if ((width <= 0 || height <= 0) || (this.width === width && this.height === height)) {
            return false;
        }

        if (this.isValid && !this.isValid(width, height)) {
            return false;
        }

        this.width = width;
        this.height = height;

        this.ru.u = {
            responsiveWidth: responsiveWidth(width, this.gridWidth, 1.0),
            responsiveHeight: responsiveHeight(height, this.gridHeight, 1.0)
        }

        const r = responsiveK(height, this.gridHeight);
        this.ru.r = {
            responsiveWidth: responsiveWidth(width, this.gridWidth, r),
            responsiveHeight: responsiveHeight(height, this.gridHeight, r)
        }

        return true;
    }

    calc = (rv) => {

        if (isFunction(rv)) {
            return rv(this.calc);
        }

        return rv.calc(this.ru[rv.context]);
    }
}

