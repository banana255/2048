const e = (sel) => document.querySelector(sel)

const es = (sel) => document.querySelectorAll(sel)

const arrayFormatByTds = function(table) {
    /*
        传入一个 table 标签，将 table 里 的 tds 生成一个 二维数组
    */
    var tds = es(table+' td')
    var trs = es(table+' tr')
    // console.log(tds, trs);
    var t = arrayInit(trs.length)
    for (var i = 0; i < trs.length; i++) {
        for (var j = 0; j < trs[i].children.length; j++) {
            t[i][j] = tds[i * trs.length + j]
        }
    }
    return t
}

const changeViewByArray = function(table, array) {
    /*
        table 是 包括 tds 的二维素组
        将 View 的 value 变成 array 中的值
    */
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            var value = array[i][j]
            var td = table[i][j]
            td.setAttribute('class', '')
            if (value != 0) {
                var className = 't' + value
                td.classList.add(className)
                td.innerHTML = value
            } else {
                td.innerHTML = ''
            }
        }
    }
}

const showView = function(array) {
    /*
        把 array 二维数组渲染成页面
    */
    var a = copyArray(array)
    var table = arrayFormatByTds('table')
    changeViewByArray(table, a)
}

const leftActionToView = function() {
    /*
        向左滑动时视图的变化
    */
    value2048 = handleLeftArray(value2048)
    showView(value2048)
    // console.log(value2048);
}

const rightActionToView = function() {
    /*
        向右滑动时视图的变化
    */
    value2048 = handleRightArray(value2048)
    showView(value2048)
    // console.log(value2048);
}

const upActionToView = function() {
    /*
        向上滑动时视图的变化
    */
    value2048 = handleUpArray(value2048)
    showView(value2048)
    // console.log(value2048);
}

const downActionToView = function() {
    /*
        向下滑动时视图的变化
    */
    value2048 = handleDownArray(value2048)
    showView(value2048)
    // console.log(value2048);
}

const init2048 = function() {
    value2048 = init2048Array()
    // console.log('initArray', a);
    showView(value2048)
}

const angleBySlide = function(dx, dy) {
    return Math.atan2(dy,dx) * 180 / Math.PI
}

const judgeDirection = function(sX, sY, eX, eY) {
    /*
        根据坐标判断 方向
        return: false 为判断不出
                'up' 为上
                'down'
                'right'
                'left'
    */
    var dx = eX - sX
    var dy = sY - eY
    var angle = angleBySlide(dx, dy);
    // 滑动距离太短 的情况
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        return false
    } else if (angle >= -45 && angle < 45) {
        return 'right'
    } else if (angle >= 45 && angle < 135) {
        return 'up'
    }else if (angle >= -135 && angle < -45) {
        return 'down'
    }else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        return 'left'
    }
}

const bindSlideEvent = function() {
    var startX, startY

    e('table').addEventListener('touchstart', function(event){
        // console.log('touchstart', event);
        startX = event.touches[0].pageX
        startY = event.touches[0].pageY
    })

    e('table').addEventListener('touchmove', function(event){
        // console.log('touchmove', event);
        // var endX = event.changedTouches[0].pageX;
        // var endY = event.changedTouches[0].pageY;
        event.preventDefault()
    })

    e('table').addEventListener('touchend', function(event){
        // console.log('touchend', event);
        var endX = event.changedTouches[0].pageX;
        var endY = event.changedTouches[0].pageY;

        var dire = judgeDirection(startX, startY, endX, endY)
        if (dire == 'up') {
            upActionToView()
        } else if (dire == 'down') {
            downActionToView()
        } else if (dire == 'left') {
            leftActionToView()
        } else if (dire == 'right') {
            rightActionToView()
        }
    })
}

const bindEvents = function() {
    bindSlideEvent()
}

var value2048 = arrayInit(4)

const textButton = function() {
    e('#button-left').addEventListener('click', function(event){
        leftActionToView()
    })
    e('#button-right').addEventListener('click', function(event){
        rightActionToView()
    })
    e('#button-up').addEventListener('click', function(event){
        upActionToView()
    })
    e('#button-down').addEventListener('click', function(event){
        downActionToView()
    })
}

const __main2048 = function() {
    init2048()
    textButton()

    bindEvents()
}
