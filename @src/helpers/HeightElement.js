import { DimensionElement } from "./DimensionElement.js";


export class HeightElement extends DimensionElement {

    prepareNew () {
        super.prepareNew()

        // preventing jumping on mobiles (solution: do not decreasing height)
        const delta = this.newDimension - this.dimension;
        if (delta != 0) {
            if (delta > 15) { // making sure that delta is changed fast
                this.previousPositiveDelta = delta;
            } else if (delta < 0 && this.previousPositiveDelta) {
                if (this.previousPositiveDelta === Math.abs(delta)) {
                    this.isValid = false; // preventing changing height to prevent jumping
                }
            }
        }
    }

}