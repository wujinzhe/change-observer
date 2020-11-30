# change-observer

一个极小的js原生对象的数据监听库

## 介绍

这是一个能够监听原生的js对象做出的改变，使用起来十分的简单

## 安装

```npm i change-observer -S```

## 用法

```JS
import Observer from 'change-observer'

var obj = {
    a: 1,
    obj: {
      name: 'xxx'
    },
    list: [1,2,3,4]
  }

  const c = new Observer(obj, (watcher) => {

    watcher((newValue, oldValue) => {
      console.log(oldValue)
      /* oldValue 
        {
          a: 1,
          obj: {
            name: 'xxx'
          },
          list: [1,2,3,4]
        }
      */

      console.log(newValue)
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
      console.log(newValue) // '333'
      console.log(oldValue) // 1
    })
  })

  c.a = '333'
  c.list.push({name: 111})
  c.list = c.list.concat([{lala: 111}])
```