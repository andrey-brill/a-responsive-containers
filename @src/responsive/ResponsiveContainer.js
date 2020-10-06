
import { isFunction, isNumber } from "../helpers/Utils.js";
import { rv } from "./Rv.js";
import { Container } from '../core/Container.js';


export class ResponsiveContainer extends Container {

    constructor (options = {}) {
        super(options);

        this.onInitialize = options.onInitialize;

        this.isInitialized = false;
        this.isListening = false;
        this.listeners = [];

        if (options.top) {
            this.isValid = isValidTopContainer;
        }
    }

    dispose = () => {
        super.dispose();

        this.isListening = false;
        this.listeners = [];
    }

    listenResizeOf (target) {

        if (this.isListening) {
            throw Error('Container already listening another target');
        }

        this.isListening = true;

        const checkSize = () => {

            if (!this.isListening) {
                return;
            }

            const rect = target.getBoundingClientRect();
            const width = rect ? rect.width : 0;
            const height = rect ? rect.height : 0;
            this.resize(width, height)

            requestAnimationFrame(checkSize);
        }

        checkSize();

        return () => {
            this.isListening = false
        }
    }


    resize = (width, height) => {

        const resized = super.resize(width, height);

        if (resized) {

            this.isInitialized = true;

            for (let listener of this.listeners) {
                listener(this.calc);
            }

            if (this.onInitialize) {
                this.onInitialize();
                delete this.onInitialize;
            }
        }

        return resized;
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

        if (this.isInitialized) {
            listener(this.calc);
        }

        this.listeners.push(listener);

        return () => {
            this.listeners = this.listeners.filter(item => item !== listener);
        };
    }

}

function isValidTopContainer (_width, height) {
    const delta = height - this.height;
    if (delta != 0) {
        if (delta > 15) { // making sure that delta is changed fast
            this.previousPositiveDelta = delta;
        } else if (delta < 0 && this.previousPositiveDelta) {
            if (this.previousPositiveDelta === Math.abs(delta)) {
                return false; // preventing changing height to prevent jumping on mobiles
            }
        }
    }

    return true;
}

