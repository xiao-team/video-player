import Video from './video'
import { VideoPlayerOption } from './type'
import { createPauseButton, createLoadingButton, createControlBar } from './dom'
import { addClass, removeClass, formatTime } from './utils'
import EventManage from './eventManage'

export default class VPlayer extends Video {
    private timer: number
    public destory: Function

    constructor(options: VideoPlayerOption) {
        super(options)
        // 往 wrapper 里装入各个物料
        this.videoWrapper.appendChild(this.video)
        this.videoWrapper.appendChild(createPauseButton())
        this.videoWrapper.appendChild(createLoadingButton())
        this.videoWrapper.appendChild(createControlBar())
        const eventManage = new EventManage(this)
        this.destory = () => {
            eventManage.moveAllEvent()
            this.videoWrapper.remove()
        }
    }

    public onContainerOver() {
        window.clearTimeout(this.timer)
        addClass(this.videoWrapper, 'vp-container-over')
        this.timer = window.setTimeout(() => {
            removeClass(this.videoWrapper, 'vp-container-over')
        }, 3000)
    }

    public setCurrentTime(time: number) {
        this.video.currentTime = time
    }

    public seekTo(time: number) {
        this.currentTime = time
        this.updateBuffered()
    }

    protected $onplay() {
        addClass(this.videoWrapper, 'vp-video-playing')
        removeClass(this.videoWrapper, 'vp-video-loadstart')
    }

    protected $onpause() {
        removeClass(this.videoWrapper, 'vp-video-playing')
    }

    protected $onloadstart() {
        addClass(this.videoWrapper, 'vp-video-loadstart')
    }
    protected $onloadeddata() {
        removeClass(this.videoWrapper, 'vp-video-loadstart')
    }

    protected $ontimeupdate() {
        let slide = document.querySelector('.vp-progress-slide'),
            current = this.currentTime,
            duration = this.duration
        const percent = current / duration * 100
        slide.setAttribute('style', `width: ${percent}%`)

        document.querySelector(
            '.vp-control-bar_timegroup'
        ).innerHTML = `<span>${formatTime(
            current
        )}</span>&nbsp;/&nbsp;<span class="vp-control-bar_timegroup_duration">${formatTime(
            duration
        )}</span>`
    }

    protected $oncanplay() {
        removeClass(this.videoWrapper, 'vp-video-loadstart')
    }

    protected updateBuffered() {
        let end = 0
        for (let i = 0; i < this.video.buffered.length; i++) {
            if (this.video.buffered.end(i) > this.video.currentTime) {
                end = this.video.buffered.end(i)
                break
            }
        }
        const bufferedPercent = +((end / this.video.duration) * 100).toFixed(2)
        const progressLoaded = document.querySelector('.vp-progress-loaded')
        progressLoaded.setAttribute('style', `width: ${bufferedPercent}%`)
    }
    protected $onprogress() {
        this.updateBuffered()
    }
    // 快退
    rewind(step: number) {
        let video = this.video
        if (video.currentTime - step > 0) {
            video.currentTime = video.currentTime - step
        } else {
            if (video.currentTime < step) {
                video.currentTime = 0.01
            }
        }
    }
    // 快进
    forward(step: number) {
        let video = this.video
        if (video.currentTime + step < video.duration) {
            video.currentTime = video.currentTime + step
        } else {
            if (video.currentTime < video.duration - 1) {
                video.currentTime = video.duration - 1
            }
        }
    }
    
    volumeUp() {
        const volume = this.video.volume + 0.1
        if (volume >= 1) this.video.volume = 1
        else this.video.volume = volume
        return this.video?.volume || 1
    }
    volumeDown() {
        const volume = this.video.volume - 0.1
        if (volume <= 0) this.video.volume = 0
        else this.video.volume = volume
        return this.video?.volume || 0
    }
}


