

const { Containers, WindowContainer, rcResize, rv } = window.ResponsiveContainers

const containers = new Containers();

const contentWidthRv = rv('100w');
const minColumnWidthRv = rv(70);

function isEnoughSpace (calc) {
    const width = calc(contentWidthRv);
    const minWidth = calc(minColumnWidthRv);
    return minWidth <= width / 2;
}

function rxResize (parentDimension, calc) {

    const dimensions = rcResize(parentDimension);

    if (isEnoughSpace(calc)) {
        dimensions.width = dimensions.width / 2;
    }

    return dimensions;
}

const windowContainer = containers.put('top', new WindowContainer({
    onInitialize: onInitialize
}));

const contentContainer = containers.put('content', { rcResize, rxResize }, 'top')
// const columnContainer = containers.put('column', { rcResize: rxResize }, 'top')


function onInitialize () {

    const root = document.getElementById('root');

    root.innerHTML = `
        <div class="menu">
            <div>Menu</div>
            <div>RC</div>
        </div>
        <div id="leftContainer" class="container">

        </div>
        <div id="rightContainer" class="container">

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
        <div class="test">
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
}

function isInIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true; // don't have access to the top window
    }
}