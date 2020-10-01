
import { isFunction } from "../helpers/Utils.js";
import { resolveKH, resolveKW, resolveResponsiveK } from './K.js';
import { context } from '../core/Context.js';


export class Container {

    constructor (gridWidth, gridHeight) {

        const { gridWidth: contextWidth, gridHeight: contextHeight } = context()
        this.gridWidth = gridWidth || contextWidth;
        this.gridHeight = gridHeight || contextHeight;

        this.gridAspectRatio = this.gridWidth / this.gridHeight;

        if (!this.gridWidth || !this.gridHeight) {
            throw Error('Grid width or height is undefined: (' + gridWidth + ', ' + gridHeight + ')')
        }

        this.width = 0;
        this.height = 0;

        this.ru = {
            r: {kW: 0, kH: 0},
            u: {kW: 0, kH: 0}
        }
    }

    dispose () {
    }

    isValid (width, height) {
        return width > 0 && height > 0;
    }

    resize (width, height) {

        this.ru.u = {
            kW: resolveKW(width, this.gridWidth, 1.0),
            kH: resolveKH(height, this.gridHeight, 1.0)
        }

        const r = resolveResponsiveK(height, this.gridHeight);
        this.ru.r = {
            kW: resolveKW(width, this.gridWidth, r),
            kH: resolveKH(height, this.gridHeight, r)
        }

    }

    calc = (rv) => {

        if (isFunction(rv)) {
            return rv(this.calc);
        }

        return rv.calc(this.ru[rv.context]);
    }
}

