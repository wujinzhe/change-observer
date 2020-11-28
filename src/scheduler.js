const deepCopy = require('deepcopy')

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
  this.data = deepCopy(originData) // 
  this.list = [] // 在一个Tick中收集到的变更路径列表
  this.callback = fn // 在每一个Tick后触发
  this.status = 0 // 0 初始化状态   1 等待状态

  /**
   * 需要修改的数据
   * @param {*} data 数据源
   * @param {*} pathArray 需要更新的属性的路径
   * @param {*} value 更新的值
   * 
   * a, [a1, a2, a3], 11   =>   a.a1.a2.a3 = 11
   */
  function setValue(data, pathArray, value) {
    var _data = data
    for(let i = 0; i < pathArray.length - 1; i++) {
      _data = _data[pathArray[i]]
    }

    _data[pathArray[pathArray.length - 1]] = value
  
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
        let newValue = deepCopy(this.data)
        const rootProps = [] // 改动属性的根属性

        this.list.forEach(item => {
          rootProps.push(item.path[0])
          newValue = setValue(newValue, item.path, item.newValue)
        })

        this.callback({
          newValue,
          oldValue: this.data,
          paths: Array.from(new Set(rootProps)) // 属性列表进行去重
        })

        this.list = [] // 清空队列
        this.data = newValue // 将原始数据更新成最新的数据
        this.status = 0 // 执行完成则将状态恢复成初始状态
      })

      this.status = 1 // 等待中
    }

    this.list.push(data)
  }
}

module.exports = Scheduler
