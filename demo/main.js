

import { ResponsiveContainers, WindowContainer, rcResize, rv, commonContainerProperties, createPrefixedProperties, commonRxProperties } from '../src/index.js'

const containers = new ResponsiveContainers();

const topWidthRv = rv('100w');
const minColumnWidthRv = rv(65);

function isEnoughSpace (calc) {
    const width = calc(topWidthRv);
    const minWidth = calc(minColumnWidthRv);
    return minWidth <= width / 2;
}

function rxResize (parentDimensions, calc) {

    const dimensions = rcResize(parentDimensions);

    if (isEnoughSpace(calc)) {
        dimensions.width = dimensions.width / 2;
    }

    return dimensions;
}

const windowContainer = containers.put('top', new WindowContainer({
    onInitialize
}));

const contentContainer = containers.put('content', { rcResize, rxResize }, 'top');


function onInitialize () {

    if (isInIframe()) {
        document.head.parentElement.classList.add('no-scrollbar');
    }

    const root = document.getElementById('root');

    root.innerHTML = `
        <div class="menu">
            <div class="content-container">
                <div class="content menu-items-container">
                    <div class="menu-item">Responsive Containers</div>
                    <div class="menu-item">Menu</div>
                </div>
            </div>
        </div>
        <div class="content-container">
            <div class="content columns-container">
                <div id="leftContainer" class="column"></div>
                <div id="rightContainer" class="column"></div>
            </div>
        </div>
    `

    const leftContainer = document.getElementById('leftContainer');
    const rightContainer = document.getElementById('rightContainer');

    const textPanel = `
        <div class="title">
            <span>Responsive title</span>
        </div>
        <div class="sub-title">
            <span>Responsive sub title</span>
        </div>
        <div class="text">
            <div>Responsive test. Some very very very very very very very very very very very very very very very very very very long text.</div>
            <div>Responsive test. Some very very very very very very very very very very very very very very very very very very very very very very very long text.</div>
            <div>Responsive test. Some very very very very very very very very very very very very very very very very very very very very very very very very very very very very long text.</div>
            <div>Responsive test. Some very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long text.</div>
            <div>Responsive test. Some very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long text.</div>
        </div>
    `.replace(/\>[\s\n]+\</g, '><')

    const iframePanel = `
        <div class="title">
            <span>Mobile version</span>
        </div>
        <div class="sub-title">
            <span>Same url as src of IFrame</span>
        </div>
        <div class="iframe-container">
          <iframe src="/demo"/>
        </div>
    `

    leftContainer.innerHTML = textPanel;
    rightContainer.innerHTML = isInIframe() ? textPanel : iframePanel;

    let properties = {
        MenuHeight: '12R',
        onResize: function (rp, calc) {
            const enough = isEnoughSpace(calc);
            rp.gColumnsContainerDirection = enough ? 'row' : 'column';
        }
    };

    contentContainer.register(root, createPrefixedProperties(commonContainerProperties(commonRxProperties(properties))));
}

function isInIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true; // don't have access to the top window
    }
}


windowContainer.autoResize();