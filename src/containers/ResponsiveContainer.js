
import { isFunction, isNumber } from "../helpers/Utils.js";
import { resolveUnitsMultipliers } from "../settings/UnitsMultipliers.js";


export class ResponsiveContainer {

    constructor (options) {

        this.isResponsiveContainer = true;

        // contexts allows possibility to calc values based on t - top, p - parent or c - current contexts
        this.contexts = {
            t: this,
            p: null,
            c: this
        };

        this.containers = [];
        this.listeners = [];

        this.rcResize = options.rcResize || (dimensions => dimensions); // (parentDimensions, calc) -> [new] {width, height} // can be null to make possible set in children classes
        this.rxResize = resolveRxResize(options.rxResize);

        this.multipliers = resolveUnitsMultipliers(options.fontMultipliers);
    }

    resize = (parentDimensions) => {

        const rcDimensions = this.rcResize(parentDimensions, this.calc); // here c-context unavailable for calc function
        this.dimensions = new Dimension(rcDimensions.width, rcDimensions.height, rcDimensions.inch || parentDimensions.inch);

        this.dimensions.rx = this.rxResize(parentDimensions, calc);

        for (let listener of this.listeners) {
            listener(this.calc);
        }

        for (let container of this.containers) {
            container.resize(this.dimensions);
        }
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

        const listener = function(calc) {
            let r = {};
            for (let key in ro) {
                r[key] = calc(ro[key]);
            }

            onResize(r, calc);
        };

        if (this.dimensions) {  // if initialized
            listener(this.calc);
        }

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

        return register(properties);
    }

    registerContainer (container) {

        container.contexts.p = this.contexts.c; // set parent container
        container.setTopContext(this.contexts.t);

        this.containers.push(container);

        if (this.dimensions) {  // if initialized
            container.resize(this.dimensions); // allowing dynamic adding new containers
        }

        return () => {
            // unsubscribing in reverse order
            this.containers = this.containers.filter(item => item !== container);

            container.setTopContext(container);
            container.context.p = undefined;
        };
    }

    setTopContext (t) {

        this.contexts.t = t;

        for (let container of this.containers) {
            container.setTopContext(t);
        }
    }

    calc = rv => {

        if (rv.isResponsiveFunction) {
            return rv(this.calc);
        }

        if (!rv.isResponsiveObject) {
            throw new Error("Value is not ResponsiveFunction or ResponsiveObject");
        }

        const { value, context, unit, round } = rv;

        const multiplier = this.multipliers[unit];
        if (!multiplier) {
            throw new Error("Unknown unit: " + unit);
        }

        const c = this.contexts[context];
        if (!c) {
            throw new Error("Context is undefined: " + context);
        }

        const v = value * multiplier * c.dimension[unit];
        return round ? Math.round(v) : v;
    }
}


function resolveRxResize (rxResize = 'inherit') {

    if (rxResize === 'inherit') {
        return (parentDimensions => parentDimensions.rx)
    }

    if (isFunction(rxResize)) {
        return (parentDimensions, calc) =>  {
            const rxDimension = rxResize(parentDimensions, calc);
            return calcRx(rxDimension.width, rxDimension.height, rxDimension.inch || parentDimensions.inch);
        }
    }

    throw new Error('Unknown rxResize: ' + rxResize);
}