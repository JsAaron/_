  /**
   * 请求模块
   * @param {String|Array} list 依赖列表
   * @param {Function} factory 模块工厂
   * @param {String} parent ? 父路径，没有使用种子模块的根路径或配置项
   * @api public
   */
  window.require = function(list, factory, parent) {
  	// 用于检测它的依赖是否都为2
  	var deps = {},
  		// 用于保存依赖模块的返回值
  		args = [],
  		// 需要安装的模块数
  		dn = 0,
  		// 已安装完的模块数
  		cn = 0,
  		id = parent || "callback" + setTimeout("1");
  	parent = parent || basepath;
  	String(list).replace($.rword, function(el) {
  		var url = loadJSCSS(el, parent)
  		if (url) {
  			dn++;
  			if (modules[url] && modules[url].state === 2) {
  				cn++;
  			}
  			if (!deps[url]) {
  				args.push(url);
  				deps[url] = "司徒正美"; //去重
  			}
  		}
  	});
  	modules[id] = { //创建一个对象,记录模块的加载情况与其他信息
  		id: id,
  		factory: factory,
  		deps: deps,
  		args: args,
  		state: 1
  	};
  	if (dn === cn) { //如果需要安装的等于已安装好的
  		fireFactory(id, args, factory); //安装到框架中
  	} else {
  		//放到检测列队中,等待checkDeps处理
  		loadings.unshift(id);
  	}
  	checkDeps();
  };



  /**
   * 定义模块
   * @param {String} id ? 模块ID
   * @param {Array} deps ? 依赖列表
   * @param {Function} factory 模块工厂
   * @api public
   */
  window.define = function(id, deps, factory) {

	var args = [].slice.call(arguments);

  	if (typeof id === "string") {
  		var _id = args.shift();
  	}

	//上线合并后能直接得到模块ID,否则寻找当前正在解析中的script节点的src作为模块ID
  	//现在除了safari外，我们都能直接通过getCurrentScript一步到位得到当前执行的script节点，
  	//safari可通过onload+delay闭包组合解决
  	id = modules[id] && modules[id].state >= 1 ? _id : getCurrentScript();

  	if (!modules[name] && _id) {
  		modules[name] = {
  			id: name,
  			factory: factory,
  			state: 1
  		}
  	}


  	factory = args[1];
  	factory.id = _id; //用于调试
  	factory.delay = function(id) {
  		args.push(id);
  		var isCycle = true;
  		try {
  			isCycle = checkCycle(modules[id].deps, id);
  		} catch (e) {}
  		if (isCycle) {
  			$.error(id + "模块与之前的某些模块存在循环依赖");
  		}
  		delete factory.delay; //释放内存
  		require.apply(null, args); //0,1,2 --> 1,2,0
  	};
  	if (id) {
  		factory.delay(id, args);
  	} else { //先进先出
  		factorys.push(factory);
  	}
  };