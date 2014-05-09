/**
 * 回调队列
 */
(function() {

    var optionsCache = {},
        rnotwhite = /\S+/g; //空格分离

    /**
     * 转化参数
     * "once memory"
     * once   true
     * memory true
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    function createOptions(options) {
        var object = optionsCache[options] = {};
        (options.match(rnotwhite) || []).forEach(function(opts, _) {
            object[opts] = true;
        })
        return object;
    }

    /**
     * 混入
     * @return {[type]} [description]
     */
    function mix(a, b) {
        for (var k in b) {
            a[k] = b[k]
        }
    }

    var objproto = Object.prototype,
        objtoString   = objproto.toString,
        arrproto      = Array.prototype,
        nativeForEach = arrproto.forEach,
        indexOf       = arrproto.indexOf,
        slice         = arrproto.slice;

    /**
     * 是否存在
     */
    function inArray(elem, arr, i) {
        return arr == null ? -1 : indexOf.call(arr, elem, i);
    }


    function aslice(o) {
        return slice.call(o);
    }

    function each(obj, callback, context) {
        if (obj == null) return;
        //如果支持本地forEach方法,并且是函数
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(callback, context);
        } else if (obj.length === +obj.length) {
            //for循环迭代
            for (var i = 0, l = obj.length; i < l; i++) {
                callback.call(context, obj[i], i, obj)
            }
        }
    };


    /**
     * once:   确保这个回调列表只执行（ .fire() ）一次(像一个递延 Deferred).
     * memory: 保持以前的值，将添加到这个列表的后面的最新的值立即执行调用任何回调 (像一个递延 Deferred).
     * 
     * 
     * @param {[type]} options [description]
     */
    function Callbacks(options) {
        options = this.options = typeof options === "string" ?
            (optionsCache[options] || createOptions(options)) :
            mix({}, options); //如果是对象

        //回调列表
        this.list = [];

        this.firingStart  =         // 回调的起点
        this.firingLength =         // 回调时的循环结尾
        this.firingIndex  = void 0; // 回调时的循环结尾

    }

    var callPoto = Callbacks.prototype;


    /**
     * 增加回调队列
     */
    callPoto.add = function() {
        if (!this.list) return;
        var start = this.list.length;
        var self = this;
        aslice(arguments).forEach(function(a, b) {
            self.list.push(a);
        })
        return this;
    };


    /**
     * 执行处理
     * @return {[type]} [description]
     */
    callPoto._fire = function(context, args) {
        //如果参数memory为true，则记录data
        var memory       = this.options.memory;
        var list         = this.list;
        var firingIndex  = this.firingIndex  = this.firingStart || 0;
        var firingLength = this.firingLength = list.length;

        for (; list && firingIndex < firingLength; firingIndex++) {
            list[firingIndex].apply(context, args)
        }

        if (list) {
            //只回调一次
            if (this.options.once) {
                this.disable();
            }
        }
    };


    /**
     * 触发指定的上下文
     * @return {[type]} [description]
     */
    callPoto.fireWith = function(context, args) {
        if (this.list) {
            this._fire(context, args)
        }
        return this
    };


    /**
     * 触发
     * @return {[type]} [description]
     */
    callPoto.fire = function() {
        this.fireWith(this, arguments)
        return this;
    };


    /**
     * 删除
     * @return {[type]} [description]
     */
    callPoto.remove = function() {
        var list;
        if(list = this.list){
            each(arguments, function(arg, _) {
                console.log(inArray(arg, list))
            })
        }
        return this;
    };


    /**
     * 关闭回调
     * @return {[type]} [description]
     */
    callPoto.disable = function() {
        this.list = void 0;
    };


    window.Callbacks = function(options) {
        return new Callbacks(options);
    };

})()