// 暂停按钮
export function createPauseButton(): HTMLElement {
    const el = document.createElement('span')
    el.className = 'vp-container-center-button vp-container-pause-button'
    el.innerHTML = '&#xe607;'
    return el
}

// 加载中
export function createLoadingButton(): HTMLElement {
    const el = document.createElement('span')
    el.className = 'vp-container-center-button vp-container-loading-button'
    el.innerHTML = '&#xe60d;'
    return el
}

// 控制条
export function createControlBar(): HTMLElement {
    const el = document.createElement('div')
    el.className = 'vp-control-bar'

    const playButton = document.createElement('span')
    playButton.className = 'vp-control-bar_playbtn'

    const timeGroup = document.createElement('span')
    timeGroup.className = 'vp-control-bar_timegroup'
    timeGroup.innerHTML =
            '<span class="vp-control-bar_timegroup_currenttime">0:00</span>&nbsp;/&nbsp;<span class="vp-control-bar_timegroup_duration">0:00</span>'

    const progress = document.createElement('span')
    progress.className = 'vp-control-bar_progress'
    progress.innerHTML = '<div class="vp-control-bar_progress_inner"><div class="vp-progress-loaded"></div><div class="vp-progress-slide"></div></div>';
    
    const fullScreenBtn = document.createElement('span')
    fullScreenBtn.className = 'vp-control-bar_full-screen-btn';

    const rateButton = document.createElement('span')
    rateButton.className = 'vp-control-bar_rate-select';
    rateButton.innerHTML = `<div class="vp-now-rate">1.0x</div>`;

    const volumeBar = document.createElement('span')
    volumeBar.className = 'vp-control-bar_volume-bar';
    volumeBar.innerHTML = `<div class="vp-menu-content">
        <div class="vp-volume-bar"
        ><div class="vp-volume-level">
        </div>
        <div class="vp-volume-volume-bar-text">70</div>
        </div>
    </div>`;

    [playButton, timeGroup, progress, rateButton, volumeBar, fullScreenBtn].forEach(element => {
        el.appendChild(element)
    });

    return el
}