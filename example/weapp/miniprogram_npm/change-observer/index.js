module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1606721446634, function(require, module, exports) {
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Observer = factory());
}(this, (function () { 

  /** 深拷贝 目前只支持基本数据类型 Object Array */
  function deepCopy(data) {
    // 如果data为原始类型，则直接返回
    if (isPrimitiveValue(data)) return data

    const clone = data instanceof Array ? [] : {};

    for (let i in data) {
      const item = data[i];
      clone[i] = (item instanceof Object) ? deepCopy(item) : item;
    }

    return clone
  }

  /** 是否为基本类型 */
  function isPrimitiveValue(value) {
    return !(value instanceof Object)
  }

  /** 是否为有效属性 */
  function isValidProperty(target, props) {
    return (
      target.hasOwnProperty(props) &&
      Object.getOwnPropertyDescriptor(target, props).enumerable &&
      Object.getOwnPropertyDescriptor(target, props).configurable
    )
  }

  function nextTick(fn) {
    // TODO: 目前使用Promise作为nextTick函数，后续还需要根据具体环境使用不同的nextTick
    if (Promise) {
      return Promise.resolve().then(fn)
    } else {
      // 如果没有Promise 则使用setTimeout （宏任务）
      return setTimeout(fn, 0);
    }
  }

  /** 调度器 
   * 想要在下一次微任务中来依次执行改变的回调
   * 
   * TODO: 后续需要使用单例模式
  */
  function Scheduler(originData, fn = () => {}) {
    this.data = deepCopy(originData); // 
    this.list = []; // 在一个Tick中收集到的变更路径列表
    this.callback = fn; // 在每一个Tick后触发
    this.status = 0; // 0 初始化状态   1 等待状态

    /**
     * 需要修改的数据
     * @param {*} data 数据源
     * @param {*} pathArray 需要更新的属性的路径
     * @param {*} value 更新的值
     * 
     * a, [a1, a2, a3], 11   =>   a.a1.a2.a3 = 11
     */
    function setValue(data, pathArray, value) {
      var _data = data;
      for(let i = 0; i < pathArray.length - 1; i++) {
        _data = _data[pathArray[i]];
      }

      _data[pathArray[pathArray.length - 1]] = value;
    
      return data
    }

    /**
     * 
     * 对同步的数据变更进行收集，然后在一个Tick后，在调用回调进行返回收集到的所有更新
     * data = { oldValue, newValue, path }
     */
    Scheduler.prototype.collect  = function collect(data) {
      // 如果是初始化状态，需要执行一个Promise
      if (this.status === 0) {
        nextTick(() => {
          let newValue = deepCopy(this.data);
          const rootProps = []; // 改动属性的根属性

          this.list.forEach(item => {
            rootProps.push(item.path[0]);
            newValue = setValue(newValue, item.path, item.newValue);
          });

          this.callback({
            newValue,
            oldValue: this.data,
            paths: Array.from(new Set(rootProps)) // 属性列表进行去重
          });

          this.list = []; // 清空队列
          this.data = newValue; // 将原始数据更新成最新的数据
          this.status = 0; // 执行完成则将状态恢复成初始状态
        });

        this.status = 1; // 等待中
      }

      this.list.push(data);
    };
  }

  const globalKey = Symbol(); // 指定监听全局时候的key

  function Observer(data, fn) {
    this.data = data;
    this.proxyCache = new WeakMap(); // 以对象为key 存放该对象对应
    this.pathCache = new WeakMap(); // 以对象为key 存放该对象所在路径的Map
    this.watchList = []; // 监听的回调函数队列

    /**
     * 需要将整体对象作为key，存储为空数组，因为后续的对象路径需要基于父对象
     * 的路径进行拼接 path.concat(props)，所以需要保证整个对象对应的路径是[]
     */
    this.pathCache.set(data, []);

    this.scheduler = new Scheduler(data, ({ newValue, oldValue, paths }) => {
      // 触发监听的回调
      // 触发全局监听的回调
      this.watchList.map((watch) => {
        if (watch.key === globalKey) {
          // 全局key的监听
          watch.fn(newValue, oldValue);
        } else if (paths.indexOf(watch.key) >= 0){
          // 根属性的key的监听，并且key需要在paths中，只有更改了的属性才会触发回调
          watch.fn(newValue[watch.key], oldValue[watch.key]);
        }
      });
    });

    // Proxy的get Handler
    this.getHandler = function getHandler(target, props, receiver) {
      /**
       * TODO: 解决数组调用contact报错的问题，后面再详细看看这个问题
       */
      if (typeof props === 'symbol') return target[props]

      const value = Reflect.get(target, props, receiver);

      // 如果为基础类型，则直接返回
      if (isPrimitiveValue(value)) return value
      
      /**
       * 以该对象为key，然后将这个对象对应的路径存储在pathCache中
       */
      const path = this.pathCache.get(target);
      this.pathCache.set(value, path.concat(props));

      /**
       * 将该value值作为key值，将该value对应的proxy对象存储起来
       * 
       * 如果该value对应的proxy存在，则直接返回
       * 如果该value对应的proxy不存在，则创建一个proxy，然后存储起来，继续返回这个proxy
       */
      let proxy = this.proxyCache.get(value);

      if (proxy === undefined) {
        proxy = new Proxy(value, this.handler);
        this.proxyCache.set(value, proxy);
      }

      return proxy
    };

    this.setHandler = function setHandler(target, props, value, receiver) {
      const oldValue = Reflect.get(target, props, receiver); // 该属性的老的值
      const result = Reflect.set(target, props, value);

      // 当前对象的属性，只有是有效属性时，才可以触发修改监听（watch）
      if (isValidProperty(target, props)) {

        const currentTargetPath = this.pathCache.get(target);

        // 收集同步更新的字段
        this.scheduler.collect({
          oldValue,
          newValue: value,
          path: currentTargetPath.concat(props)
        });
      }

      return result
    };

    this.handler = {
      // 保持两个handler里面的this是指向cache的
      get: (...argv) => this.getHandler(...argv),
      set: (...argv) => this.setHandler(...argv)
    };

    /** 监听属性的改变 */
    this.watch = (rootPath, callback) => {
      let $rootPath = rootPath;
      let $callback = callback;

      // 监听全局对象的情况
      if (typeof rootPath === 'function') {
        $rootPath = globalKey;
        $callback = rootPath;
      }

      this.watchList.push({
        key: $rootPath,
        fn: $callback
      });
    };

    fn(this.watch);

    return new Proxy(this.data, this.handler)
  }

  return Observer;

})));

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1606721446634);
})()
//# sourceMappingURL=index.js.map