
import { DimensionElement } from "./DimensionElement.js";


function defaultWindowDimensions () { return {
    inch: '1in',
    width: '100vw',
    height: '100vh'
}}

export class WindowResizer {


    constructor (options = {}) {

        options = Object.assign(defaultWindowDimensions(), options);

        this.isWindowResizer = true;

        this.elements = [];
        for (let key in options) {
            this.elements.push(new DimensionElement(key, options[key]));
        }
    }

    onResize = (onChange) => {

        if (!onChange || this.isActive || this.onChange) {
            throw new Error();
        }

        this.onChange = onChange;
        this.isActive = true;

        requestAnimationFrame(this.checkSizes);

        return () => {
            this.isActive = false;
        };
    }

    destroy () {

        this.isActive = false;
        this.onChange = undefined;

        for (let el of this.elements) {
            el.destroy();
        }
    }

    checkSizes = () => {

        if (!this.isActive) {
            return;
        }

        let isChanged = false;
        let isValid = true;

        for (let el of this.elements) {

            el.prepareNew();

            isChanged = isChanged || el.isChanged;
            isValid = isValid && el.isValid;
        }

        if (isChanged && isValid) {

            let newDimensions = {};
            for (let el of this.elements) {
                newDimensions[el.name] = el.applyNew();
            }
            this.onChange(newDimensions);
        }

        requestAnimationFrame(this.checkSizes);
    };

}
