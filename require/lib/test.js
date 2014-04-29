	    alert('执行了就test')
define(["./cart"], function(cart) {
	  alert('加载了就test')
    //return an object to define the "my/shirt" module.
    return {
        test: true
    }
});