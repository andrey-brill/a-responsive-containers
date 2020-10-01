
import { isFunction, isNumber } from "../helpers/Utils.js";
import { rv } from "../values/Rv.js";
import { Container } from '../core/Container.js';


export class ElementContainer extends Container {

    constructor (gridWidth, gridHeight) {
        super(gridWidth, gridHeight);
        this.listeners = [];
    }

    dispose = () => {
        super.dispose();

        this.isActive = false;
        delete this.target;
        this.listeners = [];
    }

    listenResize () {
        this.listenResizeOf(this.target);
    }

    listenResizeOf (target) {

        if (!this.target) {
            this.target = target;
        } else if (this.target !== target) {
            throw Error('Target already defined');
        }

        this.isActive = true;
        requestAnimationFrame(this.checkSize);

        return () => {
            this.isActive = false
        }
    }

    checkSize = () => {

        if (!this.isActive) {
            return;
        }

        const rect = this.target.getBoundingClientRect();
        const width = rect ? rect.width : 0;
        const height = rect ? rect.height : 0;
        if (this.isValid(width, height) && this.width != width && this.height != height) {
            this.width = width;
            this.height = height;
            this.resize(width, height)
        }

        requestAnimationFrame(this.checkSize);
    }


    resize = (width, height) => {
        super.resize(width, height);

        for (let listener of this.listeners) {
            listener(this.calc);
        }
    }

    register (object, properties) {
        if (properties) {
            return this.registerProperties(object, properties);
        } else {
            return this.registerObject(object);
        }
    }

    registerProperties (el, properties) {

        if (!el.style.setProperty) {
            throw new Error("Invalid element object");
        }

        const { onResize } = properties;

        const elResize = function(ro, calc) {

            if (onResize) onResize(ro, calc);

            for (let key in ro) {

                let value = ro[key];
                if (isNumber(value)) {
                    value =  value + "px";
                }

                el.style.setProperty("--" + key, value);
            }
        };

        properties.onResize = elResize;

        return this.registerObject(properties);
    }


    registerObject (object) {

        const ro = isFunction(object) ? { onResize: object } : object;

        const onResize = ro.onResize;
        if (!onResize) {
            throw new Error("onResize is required");
        }

        delete ro.onResize;

        for (let key in ro) {
            ro[key] = rv(ro[key]);
        }

        const listener = function (calc) {
            let r = {};
            for (let key in ro) {
                r[key] = calc(ro[key]);
            }

            onResize(r, calc);
        };

        if (this.target) {
            listener(this.calc);
        }

        this.listeners.push(listener);

        return () => {
            this.listeners = this.listeners.filter(item => item !== listener);
        };
    }


}

