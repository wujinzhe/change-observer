import Scheduler from './scheduler'
import { isValidProperty, isPrimitiveValue, compareValue } from './utils'
const globalKey = Symbol() // 指定监听全局时候的key

function Observer(data, fn) {
  this.data = data
  this.proxyCache = new WeakMap() // 以对象为key 存放该对象对应
  this.pathCache = new WeakMap() // 以对象为key 存放该对象所在路径的Map
  this.watchList = [] // 监听的回调函数队列

  /**
   * 需要将整体对象作为key，存储为空数组，因为后续的对象路径需要基于父对象
   * 的路径进行拼接 path.concat(props)，所以需要保证整个对象对应的路径是[]
   */
  this.pathCache.set(data, [])

  this.scheduler = new Scheduler(data, ({ newValue, oldValue, paths }) => {
    // 触发监听的回调
    // 触发全局监听的回调
    this.watchList.map((watch) => {
      if (watch.key === globalKey) {
        // 全局key的监听
        watch.fn(newValue, oldValue)
      } else if (paths.indexOf(watch.key) >= 0){
        // 根属性的key的监听，并且key需要在paths中，只有更改了的属性才会触发回调
        watch.fn(newValue[watch.key], oldValue[watch.key])
      }
    })
  })

  // Proxy的get Handler
  this.getHandler = function getHandler(target, props, receiver) {
    /**
     * TODO: 解决数组调用contact报错的问题，后面再详细看看这个问题
     */
    if (typeof props === 'symbol') return target[props]

    const value = Reflect.get(target, props, receiver)

    // 如果为基础类型，则直接返回
    if (isPrimitiveValue(value)) return value
    
    /**
     * 以该对象为key，然后将这个对象对应的路径存储在pathCache中
     */
    const path = this.pathCache.get(target)
    this.pathCache.set(value, path.concat(props))

    /**
     * 将该value值作为key值，将该value对应的proxy对象存储起来
     * 
     * 如果该value对应的proxy存在，则直接返回
     * 如果该value对应的proxy不存在，则创建一个proxy，然后存储起来，继续返回这个proxy
     */
    let proxy = this.proxyCache.get(value)

    if (proxy === undefined) {
      proxy = new Proxy(value, this.handler)
      this.proxyCache.set(value, proxy)
    }

    return proxy
  }

  this.setHandler = function setHandler(target, props, value, receiver) {
    const oldValue = Reflect.get(target, props, receiver) // 该属性的老的值
    const result = Reflect.set(target, props, value)

    // 当前对象的属性，只有是有效属性时，才可以触发修改监听（watch）
    if (isValidProperty(target, props)) {
      const currentTargetPath = this.pathCache.get(target)
      // 如果两个值不相等 才收集依赖
      if (!compareValue(value, oldValue)) {
        // 收集同步更新的字段
        this.scheduler.collect({
          oldValue,
          newValue: value,
          path: currentTargetPath.concat(props)
        })
      }
    }

    return result
  }

  this.handler = {
    // 保持两个handler里面的this是指向cache的
    get: (...argv) => this.getHandler(...argv),
    set: (...argv) => this.setHandler(...argv)
  }

  /** 监听属性的改变 */
  this.watch = (rootPath, callback) => {
    let $rootPath = rootPath
    let $callback = callback

    // 监听全局对象的情况
    if (typeof rootPath === 'function') {
      $rootPath = globalKey
      $callback = rootPath
    }

    this.watchList.push({
      key: $rootPath,
      fn: $callback
    })
  }

  fn(this.watch)

  return new Proxy(this.data, this.handler)
}

export default Observer;
