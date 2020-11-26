# change-observer

一个极小的js原生对象的数据监听库

用法

安装
```npm i change-observer -S```

使用
```JS
const Observer = require('change-observer')

var obj = {
    a: 1,
    obj: {
      name: 'xxx'
    },
    list: [1,2,3,4]
  }

  const c = new Observer(obj, (watcher) => {

    watcher((newValue, oldValue) => {
      /* oldValue 
        {
          a: 1,
          obj: {
            name: 'xxx'
          },
          list: [1,2,3,4]
        }
      */

      /* newValue
        {
          a: '333',
          obj: {
            name: 'xxx'
          },
          list: [1,2,3,4, {name: 111}, {lala: 111}]
        }
     
     */
    })

    watcher('a', (newValue, oldValue) => {
      // newValue '333'
      // oldValue 1
    })
  })

  c.a = '333'
  c.list.push({name: 111})
  c.list = c.list.concat([{lala: 111}])
```