var TZFE = function(length) {
    this.score = {
        now: 0,
        max: 0,
    }
    this.status = {
        success: false,
        false: false,
    }
    this.value = this.arrayInit(length)
    this.length = length
    this.backupData = []
    this.merge = []
}

TZFE.prototype.saveScore = function(s) {
    /*
        记录 分数
    */
    this.score.now += s
    if (this.score.now > this.score.max) {
        this.score.max = this.score.now
    }
    // console.log(this.score.now, this.score.max);
}

TZFE.prototype.backup = function() {
    var data = {
        // score: new Object(this.score),
        score: {
            now: this.score.now,
            max: this.score.max,
        },
        // status: new Object(this.status),
        status: {
            success: this.status.success,
            false: this.status.false,
        },
        value: this.value,
        length: this.length,
    }
    // console.log('backup', data, data.score);
    // console.log(data.score === this.score);
    // console.log(data.status === this.status);
    // console.log(data.value === this.value);
    this.backupData.push(data)
}

TZFE.prototype.supplementZero = function(array, direction, num) {
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

TZFE.prototype.rejectByIndex = function(array, index, direction='end') {
    /*
        将 array[index] 剔除，并在头/尾补充 0,保持长度
        direction 参数： begin 表示在头部补 0
                        end 表示在尾部补 0
    */
    var a = array.slice(0)
    a.splice(index, 1)
    a = this.supplementZero(a, direction, 1)
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

TZFE.prototype.moveArray = function(array, direction) {
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
                a = this.supplementZero(a, 'end', num)
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
                a = this.supplementZero(a, 'begin', num)
                return a
            }
        }
    }
    return a
}

TZFE.prototype.arrayByClearZero = function(array) {
    var a = array.slice(0)
    for (var i = 0; i < a.length; i++) {
        if(a[i] == 0) {
            a.splice(i, 1)
            i--
        }
    }
    a = this.supplementZero(a, 'end', array.length-a.length)
    return a
}

TZFE.prototype.handleOneLine = function(array, direction) {
    /*
    处理一行
    direction 参数： left 表示在向左滑动处理
                    right 表示在向右滑动处理
    返回处理好的数据 a & 合并位置的坐标 is
    */
    var a = array.slice(0)
    a = this.arrayByClearZero(a)
    var is = []
    var length = a.length
    a = this.moveArray(a, direction)
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
                is.push(i)
                this.saveScore(a[i])
                a = this.rejectByIndex(a, i+1, 'end')
            }
        } else if (direction == 'right') {
            if (a[length-1-i] == a[length-i-2] && a[length-1-i] != 0) {
                a[length-1-i] *= 2
                is.push(length-1-i)
                this.saveScore(a[length-1-i])
                a = this.rejectByIndex(a, length-i-2, 'begin')
            }
        }
    }
    // console.log(a);
    // a = this.moveArray(a, direction)
    return {
        a: a,
        is: is,
    }
}

TZFE.prototype.encodeArray = function(array) {
    /*
        旋转 array
            使得 上下 变 左右
    */
    // console.log('encodeArray');
    var a = this.copyArray(array)
    var length = a.length
    var r = this.arrayInit(length)
    for (var i = 0; i < length; i++) {
        for (var j = 0; j < a[i].length; j++) {
            r[i][j] = array[j][i]
        }
    }
    return r
}

TZFE.prototype.decodeArray = function(array) {
    /*
        复原 array
            让 左右 回复成 上下
    */
    // console.log('decodeArray');
    return this.encodeArray(array)
}

TZFE.prototype.compareArray = function(a1, a2) {
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

TZFE.prototype.newOneOfArray = function(result, array) {
    /*
        判断是否需要添加一个新元素，需要则添加 并 备份数据，不需要则返回{i:false, j:false}
    */
    if(!this.compareArray(array, result)) {
        result = this.arrayByCreateZero(result)
        return result
    } else {
        return {
            value: result,
            i: false,
            j: false,
        }
    }
}

TZFE.prototype.isSameLine = function(array) {
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

TZFE.prototype.isSuccess = function(array) {
    /*
        判断 成功 还是 失败, 从而改变全局变量 status
    */
    // 判断是否 成功
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            if(array[i][j] == 2048) {
                this.status.success = true
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
        if (this.isSameLine(array[i])) {
            return 1
        }
    }

    // 判断每列相邻是否有相同的值
    var a = this.encodeArray(array)
    for (var i = 0; i < a.length; i++) {
        if (this.isSameLine(a[i])) {
            return 1
        }
    }

    this.status.false = true
    console.log('失败');
}

TZFE.prototype.saveMerge = function(i, js) {
    /*
        将 js 拆成 j1 j2 ...,并和 i 组合成 [i, j] 保存到 this.merge
    */
    for (var x = 0; x < js.length; x++) {
        var r = []
        r.push(i)
        r.push(js[x])
        this.merge.push(r)
    }
}

TZFE.prototype.handleLeftArray = function(array) {
    /*
        向左滑动时 array 合并 & 移动 & 添加一个新元素 (2)
        返回 r {value, i, j} (其中 i j 是增加的新元素的坐标)
        并将 合并的坐标 保存到 this.merge
    */
    this.merge = []
    var a = this.copyArray(array)
    var r = []
    for (var i = 0; i < a.length; i++) {
        var restlt = this.handleOneLine(a[i], 'left')
        r.push(restlt.a)
        this.saveMerge(i, restlt.is)
    }
    this.isSuccess(r)
    return this.newOneOfArray(r, array)
}

TZFE.prototype.handleRightArray = function(array) {
    /*
        向右滑动时 array 合并 & 移动 & 添加一个新元素 (2)
        返回 r {value, i, j} (其中 i j 是增加的新元素的坐标)
        并将 合并的坐标 保存到 this.merge

    */
    // console.log('handleRightArray', array);
    this.merge = []
    var a = this.copyArray(array)
    var r = []
    for (var i = 0; i < a.length; i++) {
        var restlt = this.handleOneLine(a[i], 'right')
        r.push(restlt.a)
        this.saveMerge(i, restlt.is)
        // r.push(this.handleOneLine(a[i], 'right'))
    }
    this.isSuccess(r)
    return this.newOneOfArray(r, array)
    // console.log('handleRightArray end', r);
}

TZFE.prototype.encodeMerge = function() {
    var a = this.merge
    for (var i = 0; i < a.length; i++) {
        var x = a[i][0]
        var y = a[i][1]
        a[i][0] = y
        a[i][1] = x
    }
}

TZFE.prototype.handleUpArray = function(array) {
    /*
        向上滑动时 array 合并 & 移动 & 添加一个新元素 (2)
        返回 r {value, i, j} (其中 i j 是增加的新元素的坐标)
    */
    var a = this.copyArray(array)
    a = this.encodeArray(a)
    a = this.handleLeftArray(a)
    var r = {}
    r.value = this.decodeArray(a.value)
    r.i = a.j
    r.j = a.i
    this.encodeMerge()
    return r
}

TZFE.prototype.handleDownArray = function(array) {
    /*
        向下滑动时 array 合并 & 移动 & 添加一个新元素 (2)
        返回 r {value, i, j} (其中 i j 是增加的新元素的坐标)
    */
    // console.log('handleDownArray');
    var a = this.copyArray(array)
    a = this.encodeArray(a)
    a = this.handleRightArray(a)
    var r = {}
    r.value = this.decodeArray(a.value)
    r.i = a.j
    r.j = a.i
    this.encodeMerge()
    return r
}

TZFE.prototype.arrayLine = function(length) {
    // 制造一行 0
    var array = []
    for (var i = 0; i < length; i++) {
        array.push(0)
    }
    return array
}

TZFE.prototype.arrayInit = function(length) {
    /*
        制造一个 length * length 的矩阵数组, 矩阵数值为 0
    */
    var array = []
    for (var i = 0; i < length; i++) {
        array.push(this.arrayLine(length))
    }
    return array
}

TZFE.prototype.numOfZeroFromArray = function(array) {
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

TZFE.prototype.numberRandom = function(count) {
    /*
        在 0 ~ count 内,产生一个 随机数
    */
    var r = Math.random() * count
    return Math.ceil(r)
}

TZFE.prototype.copyArray = function(array) {
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

TZFE.prototype.randomInitValue = function() {
    var a = Math.random() * 10
    if (a < 8) {
        return 2
    } else {
        return 4
    }
}

TZFE.prototype.arrayByCreateZero = function(array) {
    /*
        随机挑选 二维数组 中的其中一个 0 位置赋值为 2，并返回这个 二维数组 & 坐标
    */
    var a = this.copyArray(array)
    var count = this.numOfZeroFromArray(a)
    var num = this.numberRandom(count)
    var n = 0
    var initNum = this.randomInitValue()
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

TZFE.prototype.init2048Array = function(length) {
    /*
        初始化 2048，即生成一个二维数组，随机数组中有两个 2 ,返回 二维数组 & 坐标
    */
    var initaArray = this.arrayInit(length)
    var r = this.arrayByCreateZero(initaArray)
    initArray = r.value
    var result = {
        f: {
            i: r.i,
            j: r.j,
        }
    }
    r = this.arrayByCreateZero(initArray)
    result.initArray = r.value
    result.s = {
        i: r.i,
        j: r.j,
    }
    return result
}
