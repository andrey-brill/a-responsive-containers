

// By default expecting mobile grid
// 960 - contains max number of primitive dividers

const
    MobileUniformHeightInch = 5, // Average height of new smartphones in 2020 is 5"
    GridAspectRatio = 9 / 16,
    GridHeight = 960,
    GridWidth = GridHeight * GridAspectRatio,
    DesignHeightInch = MobileUniformHeightInch,
    DesignWidthInch = DesignHeightInch * GridAspectRatio,
    InchSize = 96, // standard for browsers
    ResponsiveK = 0.25;


class Context {

    constructor(options = {}) {

        Object.assign(this, {
            inchSize: InchSize,
            responsiveK: ResponsiveK,
            designHeightInch: DesignHeightInch,
            designWidthInch: DesignWidthInch,
            gridWidth: GridWidth,
            gridHeight: GridHeight
        }, options)

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

export function inInch (dimension) {
    const { inchSize } = context()
    return dimension / inchSize;
}

export function fromInch (dimensionInch) {
    const { inchSize } = context()
    return dimensionInch * inchSize;
}