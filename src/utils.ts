import { positionMap } from './type'


/**
 * 判断是否为m3u8
 * @param {string} url 
 */
export function isM3U8(url: string): boolean {
    if (typeof url !== 'string') {
        throw new Error('The video url should be string type')
    }
    return /\.m3u8$/.test(url)
}
/**
 * 判断是否为mp4
 * @param {string} url 
 */
export function isMP4(url: string): boolean {
    if (typeof url !== 'string') {
        throw new Error('The video url should be string type')
    }
    url = url.toLowerCase()
    return /\.mp4$/.test(url)
}


function hasClass(obj: Element, cls: string) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

export function addClass(obj: Element, cls: string) {
    if (!hasClass(obj, cls)) obj.className += " " + cls;
}

export function removeClass(obj: Element, cls: string) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}

export function toggleClass(obj: Element, cls: string) {
    if (hasClass(obj, cls)) {
        removeClass(obj, cls);
    } else {
        addClass(obj, cls);
    }
}


export function findElPosition(el: HTMLElement): positionMap {
    let box: any

    if (el.getBoundingClientRect && el.parentNode) {
        box = el.getBoundingClientRect()
    }

    if (!box) {
        return {
            left: 0,
            top: 0,
        }
    }

    const docEl = document.documentElement
    const body = document.body

    const clientLeft = docEl.clientLeft || body.clientLeft || 0
    const scrollLeft = window.pageXOffset || body.scrollLeft
    const left = box.left + scrollLeft - clientLeft

    const clientTop = docEl.clientTop || body.clientTop || 0
    const scrollTop = window.pageYOffset || body.scrollTop
    const top = box.top + scrollTop - clientTop

    // Android sometimes returns slightly off decimal values, so need to round
    return {
        left: Math.round(left),
        top: Math.round(top),
    }
}

/**
 * 格式化时间为分钟形式00:00
 * @param {number} time 
 */
export function formatTime(time: number): string {
    time = time < 0 ? 0 : time
    const s = pad(Math.floor(time % 60))
    const m = pad(Math.floor(time / 60))
    return `${m}:${s}`
}
export function pad(num: number, n?: number): string {
    n = isUndefined(n) ? 2 : +n
    let result = String(num)
    while (result.length < n) {
        result = '0' + num
    }
    return result
}

/**
 * 解析urL中的query
 * @param {string} url 
 */
export function parseUrlParam(url) {
    if (!/.+\?(.+)$/.exec(url).length) return null
    const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
    const paramsArr = paramsStr.split('&'); // 将字符串以 & 分割后存到数组中
    let paramsObj: any = {};
    // 将 params 存到对象中
    paramsArr.forEach(param => {
        if (/=/.test(param)) {
            // 处理有 value 的参数
            let [key, val] = param.split('='); // 分割 key 和 value
            val = decodeURIComponent(val); // 解码
            const newval = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字

            if (paramsObj.key) {
                // 如果对象有 key，则添加一个值
                paramsObj[key] = [].concat(paramsObj[key], newval);
            } else {
                // 如果对象没有这个 key，创建 key 并设置值
                paramsObj[key] = newval;
            }
        } else {
            // 处理没有 value 的参数
            paramsObj[param] = true;
        }
    });

    return paramsObj;
}

/**
* 是否为undefinded
* @param {any} obj 
*/
export function isUndefined(obj) {
    return void 0 === obj
}


/**
 * 全屏
 * @param {dom} elem 
 */
export function requestFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen()
    } else if (elem.webkitRequestFullScreen) {
        // 对 Chrome 特殊处理，
        // 参数 Element.ALLOW_KEYBOARD_INPUT 使全屏状态中可以键盘输入。
        if (window.navigator.userAgent.toUpperCase().indexOf('CHROME') >= 0) {
            elem.webkitRequestFullScreen((Element as any).ALLOW_KEYBOARD_INPUT)
        }
        // Safari 浏览器中，如果方法内有参数，则 Fullscreen 功能不可用。
        else {
            elem.webkitRequestFullScreen()
        }
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen()
    }
}

/**
 * 取消全屏
 */
export function exitFullscreen() {
    const dom: any = document
    if (dom.exitFullscreen) {
        dom.exitFullscreen()
    } else if (dom.webkitCancelFullScreen) {
        dom.webkitCancelFullScreen()
    } else if (dom.mozCancelFullScreen) {
        dom.mozCancelFullScreen()
    }
}

/**
 * 是否全屏
 */
export function fullscreen() {
    let dom: any = document
    return (
        dom.fullscreen ||
        dom.webkitIsFullScreen ||
        dom.mozFullScreen ||
        false
    )
}

/**
 * 获取距离文档顶部的距离
 * @param e 
 */
export function getTop(e) {
    var offset = e.offsetTop
    if (e.offsetParent != null) offset += getTop(e.offsetParent)
    return offset
  }