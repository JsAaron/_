/**
 * 异步队列库
 * @return {[type]} [description]
 */
;
(function() {


    function Deferred() {

        /**
         * 异步对象
         * @type {Object}
         */
        var deferred = {

            then: function() {

            },

            done: function() {

            },

            fail: function() {

            },

            promise: function() {

            }

        }



        return deferred;
    }


    window.Deferred = Deferred;

})();