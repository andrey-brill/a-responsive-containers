
import { isFunction, isNumber } from "../helpers/Utils.js";
import { Dimensions } from "./Dimensions.js";
import { calcRx } from "./Rx.js";
import { rv } from "../values/Rv.js";



const UNIT_MULTIPLIERS = {
    rx: 1.0,
    diagonal: 0.01,
    width: 0.01,
    height: 0.01,
    min: 0.01,
    max: 0.01
};

export class Container {

    constructor (options) {

        this.isResponsiveContainer = true;

        this.contexts = {
            top: this,
            parent: null,
            current: this
        };

        this.name = options.name;

        this.containers = [];
        this.listeners = [];

         // rcResize(parentDimensions, calc) -> [new] {width, height}
        this.rcResize = options.rcResize || (parentDimensions => parentDimensions);

        // rxResize(parentDimensions, calc) -> [new] {width, height}
        // calcRx(parentDimensions, calc) -> [new] rx
        this.calcRx = resolveCalcRx(options.rxResize || this.rcResize);

    }

    findParent (name, globally = true) {

        const { parent } = this.contexts;
        if (!parent) {
            return null;
        }

        if (parent.name === name) {
            return parent;
        }

        return globally ? parent.findParent(name, true) : null;
    }

    findChildren (name, globally = true) {

        for (let child of this.containers) {
            if (child.name === name) {
                return child;
            }
        }

        if (!globally) {
            return null;
        }

        for (let child of this.containers) {
            const result = child.findChildren(name, true);
            if (result) {
                return result;
            }
        }

        return null;
    }


    resize = (parentDimensions) => {

        const rcDimensions = this.rcResize(parentDimensions, this.calc); // here c-context unavailable for calc function
        this.dimensions = new Dimensions(rcDimensions.width, rcDimensions.height, rcDimensions.inch || parentDimensions.inch);
        this.dimensions.rx = this.calcRx(parentDimensions, this.calc);

        for (let listener of this.listeners) {
            listener(this.calc);
        }

        for (let container of this.containers) {
            container.resize(this.dimensions);
        }
    }

    isInitialized () {
        return !!this.dimensions;
    }

    register (object, properties) {
        if (properties) {
            return this.registerProperties(object, properties);
        } else if (object.isResponsiveContainer) {
            return this.registerContainer(object);
        } else {
            return this.registerObject(object);
        }
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

        if (this.isInitialized()) {
            listener(this.calc);
        }

        this.listeners.push(listener);

        return () => {
            this.listeners = this.listeners.filter(item => item !== listener);
        };
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

    registerContainer (container) {

        container.contexts.parent = this.contexts.current;
        container.setTopContext(this.contexts.top);

        this.containers.push(container);

        if (this.isInitialized()) {
            container.resize(this.dimensions); // allowing dynamic adding new containers
        }

        return () => {
            // unsubscribing in reverse order
            this.containers = this.containers.filter(item => item !== container);

            container.setTopContext(container);
            container.context.parent = undefined;
        };
    }

    setTopContext (top) {

        this.contexts.top = top;

        for (let container of this.containers) {
            container.setTopContext(top);
        }
    }

    calc = (rv) => {

        if (rv.isResponsiveFunction) {
            return rv(this.calc);
        }

        if (!rv.isResponsiveObject) {
            throw new Error("Value is not ResponsiveFunction or ResponsiveObject");
        }

        const { value, context, unit, round } = rv;

        const multiplier = UNIT_MULTIPLIERS[unit];
        if (!multiplier) {
            throw new Error("Unknown unit: " + unit);
        }

        let c = this.contexts[context];
        if (!c) {

            c = context === 'parent' ? this.contexts.current : undefined;

            if (!c) {
                throw new Error("Context is undefined: " + context);
            }
        }

        const v = value * multiplier * c.dimensions[unit];
        return round ? Math.round(v) : v;
    }
}


function resolveCalcRx (rxResize) {

    if (rxResize === 'inherit') {
        return (parentDimensions => parentDimensions.rx);
    }

    if (isFunction(rxResize)) {
        return (parentDimensions, calc) =>  {
            const rxDimensions = rxResize(parentDimensions, calc);
            return calcRx(rxDimensions.width, rxDimensions.height, rxDimensions.inch || parentDimensions.inch);
        }
    }

    throw new Error('Unknown rxResize: ' + rxResize);
}