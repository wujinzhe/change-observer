
import Observer from '../../core/observer'
const originPage = Page

/** 设置值 */
function setValue(object, props, value) {
  const arr = props.split('.')
  let obj = object
  let i = 0;

  for(i; i < arr.length - 1; i++) {
    obj = obj[arr[i]]

    if (obj === null || obj === undefined) {
      console.warn(`${arr[i]}属性为null或者undefined`)
      return
    }
  }

  obj[arr[i]] = value
}

const newPage = (config) => {
  const $watcher = config.watcher || {}
  const $onLoad = config.onLoad
  const $data = config.data

  const $config = {
    ...config,
    data: $data,
    onLoad(options) {
      /**
       * 在实例中添加一个新的属性proxyData，然后劫持setData函数，每次更新时，手动更新proxyData的值
       */
      this.proxyData = new Observer($data, (watcher) => {
        Object.keys($watcher).forEach(key => {
          watcher(key, $watcher[key])
        })
      })

      // 先将原来的setData函数保存起来
      const setData = this.setData
      this.setData = (A, e) => {
        for (let i in A) {
          setValue(this.proxyData, i, A[i])
        }

        setData.call(this, A, e)
      }

      if ($onLoad) $onLoad.call(this, options) // 继续执行原始的onLoad
    }
  }
  
  return originPage($config)
}

Page = newPage
