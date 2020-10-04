
import { ElementContainer } from '../../@src/containers/ElementContainer.js';
import { TopElementContainer, commonProperties, initializeWebContext, toResponsiveColumn, WindowPrefix } from '../../@src/index.js';
import './index.scss';


initializeWebContext();

const contentContainer = new ElementContainer()
contentContainer.register(document.getElementById('root'),  Object.assign(commonProperties(), {
    rMenuHeight: '96rx'
}));

let rendered = false;

const windowContainer = new TopElementContainer();
windowContainer.register(document.body, Object.assign(commonProperties(WindowPrefix), {
    onResize: (rp) => {

        const { wuw100: width, wuh100: height } = rp;

        const responsiveColumn = toResponsiveColumn(width, height);
        contentContainer.resize(responsiveColumn.width, responsiveColumn.height);
        rp.wColumnsContainerDirection = responsiveColumn.numberOfColumns > 1 ? 'row' : 'column';

        if (!rendered) {
            renderHtml();
        }
    }
}));

windowContainer.listenResize();

function renderHtml () {

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
    `;

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
            <div>Responsive test. Some very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long text.</div>
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
          <iframe src="/"/>
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
