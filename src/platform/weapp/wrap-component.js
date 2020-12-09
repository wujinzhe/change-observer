const originComponent = Component
import Observer from '../../core/observer'

const wrapComponent = (config) => {
  const $lifetimes = config.lifetimes || {}
  const $ready = $lifetimes.ready || config.ready
  const $watcher = config.watcher || {}
  const $data = config.data
  let data = {}
  let storeKey = ''

  Object.keys($data).forEach(key => {
    if ($data[key] instanceof GenerateStore) {
      storeKey = key
    } else {
      data[key] = $data[key]
    }
  })

  return originComponent({
    ...config,
    data,
    lifetimes: {
      ...$lifetimes,
      ready(options) {
        let draft = null

        if (storeKey) {
          draft = $data[storeKey].generator()

          // 监听方法
          Object.keys($watcher).forEach(key => {
            draft.watch(key, $watcher[key])
          })
    
          draft.setStore(this, storeKey)
        }
        

        // 执行原始的方法
        if ($ready) $ready.call(this, options)
      }
    }
  })
}

Component = wrapComponent
