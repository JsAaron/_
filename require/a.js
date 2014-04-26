define('a', ['require/b', 'require/c'], function(b, c) {

	console.log('加载a', b, c)

	return 'a'
})