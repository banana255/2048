var init_array = [
    [0,2,2,0],
    [0,2,2,0],
    [0,2,2,0],
    [0,2,2,0],
]

const supplementZero = function(array, direction, num) {
    /*
        给 array 补充 num 个 0
        direction 参数： begin 表示在头部补 0
                        end 表示在尾部补 0
    */
    var a = array.slice(0)
    if (direction == 'begin') {
        for (var i = 0; i < num; i++) {
            a.unshift(0)
        }
        return a
    } else if (direction == 'end') {
        for (var i = 0; i < num; i++) {
            a.push(0)
        }
        return a
    }
}

const rejectByIndex = function(array, index, direction) {
    /*
        将 array[index] 剔除，并在头/尾补充 0
        direction 参数： begin 表示在头部补 0
                        end 表示在尾部补 0
    */
    var a = array.slice(0)
    a.splice(index, 1)
    a = supplementZero(a, direction, 1)
    return a
    // if (index == 0) {
    //     a = a.slice(1)
    // } else if (index == a.length - 1) {
    //     a.pop()
    // } else if(index > 0 && index < a.length - 1) {
    //     var qian = a.slice(0, index)
    //     var hou = a.slice(index+1)
    //     a = qian.concat(hou)
    // }
    // if (direction == 'begin') {
    //     a.unshift(0)
    // } else if (direction == 'end') {
    //     a.push(0)
    // }
}

const moveArray = function(array, direction) {
    /*
        移动数组: 根据 direction 让 array 清除 左/右 边的 0 ，
                并在另一边用补 0 的方式保持 array 原来的长度
        direction 参数： left 表示清除 左 边的 0 ，
                        right 表示清除 右 边的 0 ，
    */
    var a = array.slice(0)
    var length = a.length
    var index = 0
    if (direction == 'left') {
        for (var i = 0; i < length; i++) {
            if(a[i] != 0) {
                index = i
                // console.log(index);
                a = a.slice(index)
                var num = length - a.length
                a = supplementZero(a, 'end', num)
                return a
            }
        }
    } else if(direction == 'right') {
        for (var i = 0; i < length; i++) {
            if(a[length - 1 - i] != 0) {
                index = length - 1 - i
                a = a.slice(0, index+1)
                // console.log(a, index);
                var num = length - a.length
                a = supplementZero(a, 'begin', num)
                return a
            }
        }
    }
    return a
}

const handleOneLine = function(array, direction) {
    /*
    处理一行
    direction 参数： left 表示在向左滑动处理
                    right 表示在向右滑动处理
    */
    var a = array.slice(0)
    var length = a.length
    for (var i = 0; i < length; i++) {
        // if (a[i] == a[i+1] && a[i] != 0) {
        //     a[i] *= 2
        //     if (direction == 'left') {
        //         a = rejectByIndex(a, i+1, 'end')
        //     } else if (direction == 'right') {
        //         a = rejectByIndex(a, i+1, 'begin')
        //     }
        // }
        if (direction == 'left') {
            if (a[i] == a[i+1] && a[i] != 0) {
                a[i] *= 2
                a = rejectByIndex(a, i+1, 'end')
            }
        } else if (direction == 'right') {
            if (a[length-1-i] == a[length-i-2] && a[length-1-i] != 0) {
                a[length-1-i] *= 2
                a = rejectByIndex(a, length-i-2, 'begin')
            }
        }
    }
    // console.log(a);
    a = moveArray(a, direction)
    return a
}

const encodeArray = function(array) {
    /*
        旋转 array
            使得 上下 变 左右
    */
    // console.log('encodeArray');
    var a = copyArray(array)
    var length = a.length
    var r = arrayInit(length)
    for (var i = 0; i < length; i++) {
        for (var j = 0; j < a[i].length; j++) {
            r[i][j] = array[j][i]
        }
    }
    return r
}

const decodeArray = function(array) {
    /*
        复原 array
            让 左右 回复成 上下
    */
    // console.log('decodeArray');
    return encodeArray(array)
}

const handleLeftArray = function(array) {
    var a = copyArray(array)
    var r = []
    for (var i = 0; i < a.length; i++) {
        r.push(handleOneLine(a[i], 'left'))
    }
    return r
}

const handleRightArray = function(array) {
    // console.log('handleRightArray', array);
    var a = copyArray(array)
    var r = []
    for (var i = 0; i < a.length; i++) {
        r.push(handleOneLine(a[i], 'right'))
    }
    // console.log('handleRightArray end', r);
    return r
}

const handleUpArray = function(array) {
    var a = copyArray(array)
    a = encodeArray(a)
    a = handleLeftArray(a)
    a = decodeArray(a)
    return a
}

const handleDownArray = function(array) {
    console.log('handleDownArray');
    var a = copyArray(array)
    a = encodeArray(a)
    a = handleRightArray(a)
    a = decodeArray(a)
    return a
}

const arrayLine = function(length) {
    // 制造一行 0
    var array = []
    for (var i = 0; i < length; i++) {
        array.push(0)
    }
    return array
}

const arrayInit = function(length) {
    /*
        制造一个 length * length 的矩阵数组, 矩阵数值为 0
    */
    const array = []
    for (var i = 0; i < length; i++) {
        array.push(arrayLine(length))
    }
    return array
}

const numOfZeroFromArray = function(array) {
    /*
        返回: 二维数组中 0 的个数
    */
    var num = 0
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            if(array[i][j] == 0) {
                num++
            }
        }
    }
    return num
}

const numberRandom = function(count) {
    /*
        在 0 ~ count 内,产生一个 随机数
    */
    const r = Math.random() * count
    return Math.ceil(r)
}

const copyArray = function(array) {
    /*
        复制二维数组
    */
    // console.log('copyArray');
    var r = []
    for (var i = 0; i < array.length; i++) {
        r.push(array[i].slice(0))
    }
    return r
}

const arrayByCreateZero = function(array) {
    /*
        随机挑选 二维数组 中的其中一个 0 位置赋值为 2，并返回这个 二维数组
    */
    var a = copyArray(array)
    const count = numOfZeroFromArray(a)
    const num = numberRandom(count)
    var n = 0
    const initNum = 2
    for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < a[i].length; j++) {
            if(a[i][j] == 0) {
                n++
            }
            if(num == n) {
                a[i][j] = initNum
                return a
            }
        }
    }
}

const init2048 = function() {
    /*
        初始化 2048，即生成一个二维数组，随机数组中有两个 2
    */
    var initaArray = arrayInit(4)
    initArray = arrayByCreateZero(initaArray)
    initArray = arrayByCreateZero(initArray)
}
