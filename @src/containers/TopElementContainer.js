
import { ElementContainer } from "./ElementContainer.js";


export class TopElementContainer extends ElementContainer {

    listenResize (target = document.body) {
        this.listenResizeOf(target)
    }

    isValid (width, height) {

        if (!super.isValid(width, height)) {
            return false;
        }

        const delta = this.height - height;
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
}