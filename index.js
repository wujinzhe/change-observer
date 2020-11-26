/** 深拷贝 */
function deepCopy(data) {
  // 如果data为原始类型，则直接返回
  if (!(data instanceof Object)) return data

  const clone = data instanceof Array ? [] : {}

  for (let i in data) {
    const item = data[i]
    clone[i] = (item instanceof Object) ? deepCopy(item) : item
  }

  return clone
}

/** 是否为原始对象 */
function isPrimitiveObject(value) {
  return toString.call(value) === '[object Object]'
}

/** 是否为数组 */
function isArray(value) {
  return Array.isArray(value)
}


/** 调度器 
 * 想要在下一次微任务中来依次执行改变的回调
*/
function Scheduler(originData, fn) {
  this._originData = deepCopy(originData)
  this.list = []
  this.callback = fn || function(data){}
  this.status = 0 // 0 初始化状态   1 等待状态

  /**
   * 需要修改的数据
   * @param {*} data 数据源
   * @param {*} pathArray 需要更新的属性的路径
   * @param {*} value 更新的值
   */
  function setValue(data, pathArray, value) {
    var _data = data
    for(let i = 0; i < pathArray.length - 1; i++) {
      _data = _data[pathArray[i]]
    }

    _data[pathArray[pathArray.length - 1]] = value
  
    return data
  }

  Scheduler.prototype.addTask = function addTask(data) {
    // 如果是初始化状态，需要执行一个Promise
    if (this.status === 0) {
      Promise.resolve().then(() => {
        this.status = 0
        let newValue = deepCopy(this._originData)
        const oldValue = this._originData
        const rootProps = []

        this.list.forEach(item => {
          rootProps.push(item.path[0])

          newValue = setValue(newValue, item.path, item.newValue)
        })

        this.callback({
          newValue,
          oldValue,
          paths: Array.from(new Set(rootProps))
        })

        this.list = [] // 清空队列
        this._originData = newValue // 将原始数据更新成最新的数据
      })

      this.status = 1 // 等待中
    }

    this.list.push(data)
  }
}

/** 是否为有效属性 */
function isValidProperty(target, props) {
  // 属性不是原型链上的，并且是可枚举的
  return (
    target.hasOwnProperty(props) &&
    Object.getOwnPropertyDescriptor(target, props).enumerable &&
    Object.getOwnPropertyDescriptor(target, props).configurable
  ) 
}

/** 是否为可读属性 */
// function isWriteProperty(target, props) {
//   return Object.getOwnPropertyDescriptor(target, props).writable
// }

function Observer(data, fn) {
  this.data = data
  this.proxyCache = new WeakMap()
  this.pathCache = new WeakMap()
  const watchList = {} // 监听对象
  const globalWatchList = [] // 全局监听

  this.scheduler = new Scheduler(data, ({ newValue, oldValue, paths }) => {

    // 触发全局监听的回调
    if (globalWatchList.length > 0) {
      globalWatchList.forEach(item => item(newValue, oldValue))
    }

    // 触发单个属性监听的回调
    paths.forEach(item => {
      const callbackList = watchList[item]
      
      // 只有callbackList为回调函数队列，才可以继续循环执行
      if (callbackList instanceof Array) {
        callbackList.forEach(callback => {
  
          if (typeof callback === 'function') {
            callback(newValue[item], oldValue[item])
          }
        })
      }
    })
  })


  this.getHandler = function getHandler(target, props, receiver) {
    const value = Reflect.get(target, props, receiver)

    if (
      !(value instanceof Object) // 基础类型属性
      // !isValidProperty(target, props) // 无效属性
    ) {
      return value
    }

    /**
     * 如果target是最外层，则初始化target为key的数据 初始化为[]
     * 
     */
    if (target === data && !this.pathCache.get(target)) {
      this.pathCache.set(target, [])
    }
    
    // 如果当前的值也是对象，则继续添加pathCache中的路径
    if (value instanceof Object) {
      const path = this.pathCache.get(target)

      this.pathCache.set(value, path.concat(props))
    }

    /**
     * proxy的缓存
     */
    let proxy = this.proxyCache.get(value)

    if (proxy === undefined) {
      proxy = new Proxy(value, this.handler)
      this.proxyCache.set(value, proxy)
    }

    return proxy
  }

  this.setHandler = function setHandler(target, props, value, receiver) {
    const oldValue = Reflect.get(target, props, receiver)
    const result = Reflect.set(target, props, value)

    // 当前对象的路径，只有是有效路径时，才可以触发修改监听（watch）
    if (isValidProperty(target, props)) {

      if (target === data && !this.pathCache.get(target)) {
        this.pathCache.set(target, [])
      }

      let prevPath = this.pathCache.get(target)
      const path = prevPath.concat(props)

      // 收集同步更新的字段
      this.scheduler.addTask({
        oldValue,
        newValue: value,
        path
      })
    }

    return result
  }

  this.handler = {
    // 保持两个handler里面的this是指向cache的
    get: (...argv) => this.getHandler(...argv),
    set: (...argv) => this.setHandler(...argv)
  }

  this.watch = function watch(rootPath, callback) {

    if (typeof rootPath === 'function') {
      return globalWatchList.push(rootPath)
    }

    // 监听对应的路径的改变，如果有多个监听的回调，则按顺序执行
    const pathList = watchList[rootPath] || []
    pathList.push(callback)

    watchList[rootPath] = pathList
  }

  fn(this.watch)

  return new Proxy(this.data, this.handler)
}

export default Observer;
