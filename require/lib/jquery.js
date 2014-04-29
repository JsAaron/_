	    alert('执行了就jQuery')
define(['test',"./cart"], function(test,cart) {
	alert('加载了就jQuery')
	//return an object to define the "my/shirt" module.
	return {
		jQuery: true
	}
});