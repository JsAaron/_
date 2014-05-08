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


    var slice = Array.prototype.slice;

    function aslice(o) {
        return slice.call(o);
    }


    function Callbacks(options) {
        options = this.options = typeof options === "string" ?
            (optionsCache[options] || createOptions(options)) :
            mix({}, options); //如果是对象

        //回调列表
        this.list = [];

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


    callPoto.remove = function() {};



    callPoto.disable = function() {};



    window.Callbacks = function(options) {
        return new Callbacks(options);
    };

})()