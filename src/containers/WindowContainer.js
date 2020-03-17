
import { ResponsiveContainer } from "./ResponsiveContainer";
import { WindowResizer } from "../helpers/WindowResizer";


export class WindowContainer extends ResponsiveContainer {

    constructor (options) {

        if (!options.rxResize) {
            options.rxResize = rcResize || (dimensions => dimensions);
        }

        super(options);

        this.onInitialize = options.onInitialize || (x => x);
    }

    autoResize (options) {

        if (this.windowResizer) {
            throw Error();
        }

        this.windowResizer = options.isWindowResizer ? options : new WindowResizer(options)

        let initialized = false;

        this.windowResizer.onResize((dimensions) => {

            if (!initialized) {
                this.onInitialize();
                initialized = true;
            }

            this.resize(dimensions);
        });

        return () => {
            this.windowResizer.destroy();
            delete this.windowResizer;
        }
    }

}