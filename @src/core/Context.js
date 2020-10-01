

class Context {

    constructor(options = {}) {

        Object.assign(this, options);

        if (!this.inchSize || !this.responsiveK ||
            !this.designHeightInch || !this.designWidthInch ||
            !this.gridWidth || !this.gridHeight) {
                throw new Error('Some option is undefined: ', options);
        }

        this.responsiveMultiplier = 1.0 / this.gridHeight;
        this.gridAspectRatio = this.gridWidth / this.gridHeight;

        this.contextHeight = this.designHeightInch * this.inchSize;

    }

}


export function initializeContext(options) {
    const context = new Context(options);
    Context.instance = context;
}

export function context() {

    if (Context.instance) {
        return Context.instance;
    }

    throw Error("ResponsiveContext didn't initialized")
}

export function toInch (dimension) {
    const { inchSize } = context()
    return dimension / inchSize;
}

export function fromInch (dimensionInch) {
    const { inchSize } = context()
    return dimensionInch * inchSize;
}