

export class DimensionElement {

    constructor (name, dimension) {

        this.name = name;
        this.el = document.createElement('div');

        // making sure that the element is invisible and outside of the screen
        Object.assign(this.el.style, {
            width: dimension,
            position: 'absolute',
            height: '0px',
            top: '-1000px',
            left: '0px',
            opacity: 0
        });

        document.body.appendChild(this.el);

        this.prepareNew();
    }

    prepareNew () {

        const rect = this.el.getBoundingClientRect();
        this.newDimension = rect ? rect.width : 0;

        this.isValid = this.newDimension > 0;
        this.isChanged = this.dimension !== this.newDimension;
    }

    applyNew () {

        if (!this.isValid) {
            throw new Error("Invalid value cant be applied");
        }

        return (this.dimension = this.newDimension);
    }

    destroy () {
        document.body.removeChild(this.el);
        this.el = null;
    }
}
