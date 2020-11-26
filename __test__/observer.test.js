const Observer = require('../src/observer.js')
const { deepCopy } = require('../src/utils')
// console.log("Observer", Observer)
test('array', (done) => {
  var obj = {
    a: 1,
    obj: {
      name: 'xxx'
    },
    list: [1,2,3,4]
  }
  const copyObj = deepCopy(obj)

  const c = new Observer(obj, (watcher) => {

    watcher((newValue, oldValue) => {
      expect(newValue).toEqual({
        a: '333',
        obj: {
          name: 'yyy',
          ooo: 'ooo'
        },
        list: [1,2,3,4,{name: 111},{lala: 111}]
      })
      expect(oldValue).toEqual(copyObj)
      done()
    })
  })

  c.a = '333'
  c.obj.name = 'yyy'
  c.obj.ooo = 'ooo'
  c.list.push({name: 111})
  c.list = c.list.concat([{lala: 111}])
})


test('watch props', (done) => {
  var obj = {
    a: 1,
    obj: {
      name: 'xxx'
    },
    list: [1,2,3,4]
  }

  const c = new Observer(obj, (watcher) => {

    watcher('a', (newValue, oldValue) => {
      expect(newValue).toEqual('333')
      expect(oldValue).toEqual(1)
      done()
    })
  })

  c.a = '333'
})