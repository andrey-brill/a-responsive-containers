
import { ResponsiveContainer } from "./ResponsiveContainer";


export class Containers {

    constructor () {
        this.containers = {};
    }

    put (name, containerOrOptions, parentName = undefined) {

        if (this.containers[name]) {
            throw new Error('Not unique name for container: ' + name);
        }

        const container = resolveContainer(containerOrOptions);

        const containerItem  = {
            container
        }

        if (parentName) {
            const parent = this.getContainer(parentName);
            containerItem.unsubscriber = parent.register(container);
        }

        this.containers[name] = containerItem;

        return container;
    }


    destroy () {

        for (let { unsubscriber } of Object.values(this.containers)) {
            if (unsubscriber) unsubscriber();
        }

        this.containers = {}
    }

    getContainer (name) {

        const containerItem = this.containers[name];

        if (!containerItem) {
            throw new Error('Container with name: "' + name + '" not found.');
        }

        return containerItem.container;
    }
}


function resolveContainer (containerOrOptions) {

    if (containerOrOptions.isResponsiveContainer) {
        return containerOrOptions;
    }

    return new ResponsiveContainer(containerOrOptions);
}