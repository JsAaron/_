
        alert('执行了就main')
require(['jquery'], function(jquery, test) {
    alert('加载了就main')
    console.log(jquery, test)

});


console.log(Object.keys(require))