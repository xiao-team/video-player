import VideoPlayer from './player'
import { findElPosition } from './utils'
import { addClass, removeClass, exitFullscreen, requestFullscreen, getTop } from './utils'
import FullscreenApi from './fullscreen'
interface EventMap {
    callback: EventFunction,
    name: string,
    dom: HTMLElement | Window | Document
}
interface EventFunction {
    (evt: Event): void;
}
const rateGroup = ['0.75','1.0','1.25','1.5', '1.75', '2.0']
let nowRateIndex = 1
export default class EventManage {
    private player: VideoPlayer
    private ifFullScreen: boolean = false
    private progressDragStart: boolean = false
    private volumeDragStart: boolean = false
    private isProgressDragging: boolean = false
    private isVolumeDragging: boolean = false
    public static eventList: Array<EventMap> = []
    private tempVolume: number = 0.7
    constructor(player) {
        this.player = player
        this.playerEvent()
        this.progressEvent()
        this.controlBarEvent()
        this.volumeEvent()
        this.windowEvent()
    }

    // 添加监听事件
    private addEvent(dom: HTMLElement | Window | Document, name: string, callback: EventFunction) {
        const cbk = function (event: Event) {
            callback(event)
        }
        dom.addEventListener(name, cbk, false)
        EventManage.eventList.push({
            callback: cbk,
            name,
            dom
        })
    }

    // 移除所有事件
    public moveAllEvent() {
        EventManage.eventList.forEach(item => {
            item.dom.removeEventListener(item.name, item.callback)
        })
    }
    private playerEvent() {
        const player = this.player
        this.addEvent(player.videoWrapper, 'click', () => {
            player.toggle()
        })
        this.addEvent(player.videoWrapper, 'mousemove', () => {
            player.onContainerOver()
        })
    }

    private progressEvent() {

        const progress: HTMLElement = document.querySelector('.vp-control-bar_progress_inner'),
            slide: HTMLElement = document.querySelector('.vp-progress-slide'),
            player = this.player,
            progressWrapper: HTMLElement = document.querySelector('.vp-control-bar_progress')

        this.addEvent(progress, 'mousedown', (event: any) => {
            this.progressDragStart = true
            addClass(player.videoWrapper, 'vp-video-loadstart')
            const left = event.pageX - findElPosition(progress).left
            const progressWidth = progress.offsetWidth
            const percent = left / progressWidth * 100
            slide.setAttribute('style', `width: ${percent}%`)
            const duration = player.duration
            const currentTime: number = duration * percent / 100 || 0
            player.seekTo(currentTime)
        })

        this.addEvent(progressWrapper, 'mousemove', (event: any) => {
            if (this.progressDragStart) {
                addClass(player.videoWrapper, 'vp-video-loadstart')
                const left = event.pageX - findElPosition(progress).left
                const progressWidth = progress.offsetWidth
                const percent = left / progressWidth * 100
                slide.setAttribute('style', `width: ${percent}%`)
                const duration = player.duration
                const currentTime: number = duration * percent / 100 || 0
                if (!this.isProgressDragging) this.isProgressDragging = true
                player.seekTo(currentTime)
            }
        })
    }

    private controlBarEvent() {
        const player = this.player

        const controlBar: HTMLElement = document.querySelector('.vp-control-bar')
        this.addEvent(controlBar, 'click', (event) => {
            event.stopPropagation()
        })

        const playBtn: HTMLElement = document.querySelector('.vp-control-bar_playbtn')
        this.addEvent(playBtn, 'click', () => {
            player.toggle()
        })

        const fullScreenBtn: HTMLElement = document.querySelector('.vp-control-bar_full-screen-btn')
        const nowRateBtn: HTMLElement = document.querySelector('.vp-now-rate')
        this.addEvent(fullScreenBtn, 'click', (event) => {
            event.stopPropagation()
            if (this.ifFullScreen) {
                exitFullscreen()
            } else {
                requestFullscreen(player.videoWrapper)
            }
        })

        this.addEvent(nowRateBtn, 'click', (event) => {
            event.stopPropagation()
            let nextIndex = nowRateIndex + 1
            if (nowRateIndex >= rateGroup.length - 1) nextIndex = 0
            nowRateIndex = nextIndex
            nowRateBtn.innerText = rateGroup[nowRateIndex] + 'x'
            player.video.playbackRate = Number(rateGroup[nowRateIndex])
        })

        const videoWrapper: HTMLElement = document.getElementById('video-player')

        this.addEvent(videoWrapper, 'x5videoexitfullscreen', () => {
            this.ifFullScreen = false
            removeClass(player.videoWrapper, 'vp-container-full-screen')
        })
        this.addEvent(videoWrapper, 'webkitendfullscreen', () => {
            this.ifFullScreen = false
            removeClass(player.videoWrapper, 'vp-container-full-screen')
        })

    }
    /**
     * 设置音量
     * @param volume 
     */
    private setVolume(volume: number) {
        const volumeSlide: HTMLElement = document.querySelector('.vp-volume-level'),
            player = this.player,
            volumeText: HTMLElement = document.querySelector('.vp-volume-volume-bar-text')

        volumeText.innerText = String(Math.round(volume * 100))
        volumeSlide.setAttribute('style', `height: ${volume * 100}%`)
        player.volume = volume
    }
    /**
     * 根据事件计算出应设置的音量
     * @param event 
     */
    private computeVolume(event: any): number {
        const volumeBar: HTMLElement = document.querySelector('.vp-volume-bar')
        const barHeight = volumeBar.offsetHeight
        let length = getTop(volumeBar) + barHeight - event.pageY - 1
        if (length >= barHeight) length = barHeight
        else if (length < 0) length = 0
        return (((length / barHeight) * 100) | 0) / 100
    }
    /**
     * 音量事件
     */
    private volumeEvent() {
        const volumeBar: HTMLElement = document.querySelector('.vp-volume-bar'),
            player = this.player,
            volumeWrapper: HTMLElement = document.querySelector('.vp-menu-content'),
            volumeContainer: HTMLElement = document.querySelector('.vp-control-bar_volume-bar')

        this.addEvent(volumeBar, 'mousedown', (event: any) => {
            this.volumeDragStart = true
            this.setVolume(this.computeVolume(event))
        })

        this.addEvent(volumeWrapper, 'mousemove', (event: any) => {
            if (this.volumeDragStart) {
                if (!this.isVolumeDragging) this.isVolumeDragging = true
                this.setVolume(this.computeVolume(event))
            }
        })
        // 阻止点击事件冒泡
        this.addEvent(volumeWrapper, 'click', (event) => {
            event.stopPropagation()
        })

        // 点击切换是否静音
        this.addEvent(volumeContainer, 'click', (event) => {
            if (player.volume === 0) {
                this.setVolume(this.tempVolume)
                removeClass(volumeContainer, 'vp-control-bar_volume-bar--muted')
            } else {
                this.tempVolume = player.volume
                addClass(volumeContainer, 'vp-control-bar_volume-bar--muted')
                this.setVolume(0)
            }
        })

    }
    /**
     * 窗口事件，包括键盘事件
     */
    private windowEvent() {
        const player = this.player
        this.addEvent(document, 'mouseup', () => {
            this.progressDragStart = false
            this.isProgressDragging = false
            this.volumeDragStart = false
            this.isVolumeDragging = false
        })
        this.addEvent(document, FullscreenApi['fullscreenchange'], () => {
            const isFullscreen = !!document[FullscreenApi['fullscreenElement']]
            if (isFullscreen) {
                this.ifFullScreen = true
                addClass(player.videoWrapper, 'vp-container-full-screen')
            } else {
                this.ifFullScreen = false
                removeClass(player.videoWrapper, 'vp-container-full-screen')
            }
        })
        this.addEvent(window, 'keydown', (e: any) => {
            const step = 20
            switch (e.keyCode) {
                case 37:
                    player.rewind(step)
                    break
                case 39:
                    player.forward(step)
                    break
                case 32:
                    e.preventDefault() // 防止空格触发按钮点击事件
                    player.toggle()
                    break
                case 38:
                    this.setVolume(player.volumeUp())
                    break
                case 40:
                    this.setVolume(player.volumeDown())
                    break
                default:
                    // console.log(e.keyCode)
                    break
            }
        })

    }
}