import { VideoPlayerOption } from './type'
import { isM3U8, isMP4 } from './utils'

export default class Video {
    public video: HTMLVideoElement
    public videoWrapper: HTMLElement

    constructor(options: VideoPlayerOption) {
        this.videoWrapper = options.el || document.body
        this.videoWrapper.classList.add('vp-container')

        this.createVideo()

        if (options.url) this.setUrl(options.url)
        this.$addEvent()
    }
    
    private createVideo() {
        this.video = document.createElement('video')
        this.video.setAttribute('crossorigin', 'anonymous')
        this.video.setAttribute('id', 'video-player')
        this.video.setAttribute('playsinline', 'true')
        this.video.setAttribute('x5-video-player-fullscreen', 'true')
        this.video.setAttribute('x5-video-player-type', 'h5')
        // this.video.setAttribute('poster', 'https://i.loli.net/2020/10/31/no5BSXl8DWITKGZ.jpg') 
        this.video.className = 'vp-video'
        this.video.volume = 0.7
    }

    public setUrl(url: string) {
        if (isM3U8(url)) {
            if ((window as any).Hls && (window as any).Hls.isSupported()) {
                const hls = new (window as any).Hls()
                hls.loadSource(url)
                hls.attachMedia(this.video)
            } else {
                throw new Error('Please load the hls.js before video init')
            }
        } else if (isMP4(url)) {
            this.video.src = url
        } else {
            throw new Error('UnSupport video url')
        }
    }

    get currentTime(): number {
        return this.video && this.video.currentTime || 0
    }

    set currentTime(time: number) {
        this.video && (this.video.currentTime = time)
    }
    get volume(): number {
        return this.video && this.video.volume || 0
    }

    set volume(volume: number) {
        this.video && (this.video.volume = volume)
    }
    
    get duration(): number {
        return this.video && this.video.duration || 0
    }
    
    public play(url?: string) {
        if (!url) {
            this.video && this.video.play()
        } else {
            this.setUrl(url)
        }
    }

    public pause() {
        this.video && this.video.pause()
    }

    public toggle() {
        if (this.video.paused === true) this.play()
        else if (this.video.paused === false) this.pause()
    }

    private $addEvent() {
        let eventArr = ['play', 'pause', 'loadstart', 'loadeddata', 'progress', 'canplay', 'timeupdate', 'ended']
        eventArr.forEach(item => {
            this.video.addEventListener(item, () => {
                this['$on'+ item]()
            })
        })
    }
    protected $onplay() {}
    protected $onpause() {}
    protected $onloadstart() {}
    protected $onloadeddata() {}
    protected $onprogress() {}
    protected $oncanplay() {}
    protected $ontimeupdate() {}
    protected $onended() {}
}