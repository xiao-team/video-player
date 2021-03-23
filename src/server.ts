import VideoPlayer from './player'
import './sass/index.scss'
const player = new VideoPlayer({
    el: document.getElementById('video'),
    url: 'http://iqiyi.cdn9-okzy.com/20200820/14254_728b13a0/index.m3u8'
    // url: 'http://youku.com-youku.com/20180125/aAquH2CA/index.m3u8'
})

// setTimeout(() => {
//     player.destory()
//     console.log('destory')
// }, 5000)