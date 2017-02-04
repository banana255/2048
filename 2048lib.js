// var init_array = [
//     [0,2,2,0],
//     [0,2,2,0],
//     [0,2,2,0],
//     [0,2,2,0],
// ]
var score = {
    now: 0,
    max: 0,
}

var statusSuc = {
    success: false,
    false: false,
}

// console.log(status);

const saveScore = function(s) {
    /*
        记录 分数
    */
    score.now += s
    if (score.now > score.max) {
        score.max = score.now
    }
    // console.log(score.now, score.max);
}

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

const rejectByIndex = function(array, index, direction='end') {
    /*
        将 array[index] 剔除，并在头/尾补充 0,保持长度
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

const arrayByClearZero = function(array) {
    var a = array.slice(0)
    for (var i = 0; i < a.length; i++) {
        if(a[i] == 0) {
            a.splice(i, 1)
            i--
        }
    }
    a = supplementZero(a, 'end', array.length-a.length)
    return a
}

const handleOneLine = function(array, direction) {
    /*
    处理一行
    direction 参数： left 表示在向左滑动处理
                    right 表示在向右滑动处理
    */
    var a = array.slice(0)
    a = arrayByClearZero(a)
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
                saveScore(a[i])
                a = rejectByIndex(a, i+1, 'end')
            }
        } else if (direction == 'right') {
            if (a[length-1-i] == a[length-i-2] && a[length-1-i] != 0) {
                a[length-1-i] *= 2
                saveScore(a[length-1-i])
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

const compareArray = function(a1, a2) {
    /*
        比较两个 二维数组 是否相等
    */
    for (var i = 0; i < a1.length; i++) {
        for (var j = 0; j < a1[i].length; j++) {
            if(a1[i][j] != a2[i][j]) {
                // console.log('不相等');
                return false
            }
        }
    }
    // console.log('相等');
    return true
}

const newOneOfArray = function(result, array) {
    /*
        判断是否需要添加一个新元素，需要则添加，不需要则返回{i:false, j:false}
    */
    if(!compareArray(array, result)) {
        result = arrayByCreateZero(result)
        return result
    } else {
        return {
            value: result,
            i: false,
            j: false,
        }
    }
}

const isSameLine = function(array) {
    /*
        判断 一维数组 是否有相邻 两个 是相等的，如果有则返回 true
    */
    for (var i = 0; i < array.length-1; i++) {
        if(array[i] == array[i+1]) {
            return true
        }
    }
    return false
}

const isSuccess = function(array) {
    /*
        判断 成功 还是 失败, 从而改变全局变量 status
    */
    // 判断是否 成功
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            if(array[i][j] == 2048) {
                statusSuc.success = true
                console.log('成功');
                return 1
            }
        }
    }

    // 判断是否有有 空格 存在
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            if(array[i][j] == 0) {
                return 1
            }
        }
    }

    // 判断每行相邻是否有相同的值
    for (var i = 0; i < array.length; i++) {
        if (isSameLine(array[i])) {
            return 1
        }
    }

    // 判断每列相邻是否有相同的值
    var a = encodeArray(array)
    for (var i = 0; i < a.length; i++) {
        if (isSameLine(a[i])) {
            return 1
        }
    }

    statusSuc.false = true
    console.log('失败');
}

const handleLeftArray = function(array) {
    /*
        向左滑动时 array 合并 & 移动 & 添加一个新元素 (2)
        返回 r {value, i, j} (其中 i j 是增加的新元素的坐标)
    */
    var a = copyArray(array)
    var r = []
    for (var i = 0; i < a.length; i++) {
        r.push(handleOneLine(a[i], 'left'))
    }
    isSuccess(r)
    return newOneOfArray(r, array)
}

const handleRightArray = function(array) {
    /*
        向右滑动时 array 合并 & 移动 & 添加一个新元素 (2)
        返回 r {value, i, j} (其中 i j 是增加的新元素的坐标)
    */
    // console.log('handleRightArray', array);
    var a = copyArray(array)
    var r = []
    for (var i = 0; i < a.length; i++) {
        r.push(handleOneLine(a[i], 'right'))
    }
    isSuccess(r)
    return newOneOfArray(r, array)
    // console.log('handleRightArray end', r);
}

const handleUpArray = function(array) {
    /*
        向上滑动时 array 合并 & 移动 & 添加一个新元素 (2)
        返回 r {value, i, j} (其中 i j 是增加的新元素的坐标)
    */
    var a = copyArray(array)
    a = encodeArray(a)
    a = handleLeftArray(a)
    var r = {}
    r.value = decodeArray(a.value)
    r.i = a.j
    r.j = a.i
    return r
}

const handleDownArray = function(array) {
    /*
        向下滑动时 array 合并 & 移动 & 添加一个新元素 (2)
        返回 r {value, i, j} (其中 i j 是增加的新元素的坐标)
    */
    // console.log('handleDownArray');
    var a = copyArray(array)
    a = encodeArray(a)
    a = handleRightArray(a)
    var r = {}
    r.value = decodeArray(a.value)
    r.i = a.j
    r.j = a.i
    return r
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
        随机挑选 二维数组 中的其中一个 0 位置赋值为 2，并返回这个 二维数组 & 坐标
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
                // console.log('lib new', i, j);
                return {
                    value: a,
                    i: i,
                    j: j,
                }
            }
        }
    }
}

const init2048Array = function() {
    /*
        初始化 2048，即生成一个二维数组，随机数组中有两个 2 ,返回 二维数组 & 坐标
    */
    var initaArray = arrayInit(4)
    var r = arrayByCreateZero(initaArray)
    initArray = r.value
    var result = {
        f: {
            i: r.i,
            j: r.j,
        }
    }
    r = arrayByCreateZero(initArray)
    result.initArray = r.value
    result.s = {
        i: r.i,
        j: r.j,
    }
    return result
}
