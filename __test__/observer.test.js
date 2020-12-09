import Observer from '../src/core/observer.js'

test('array', (done) => {
  var copyObj = {
    a: 1,
    obj: {
      name: 'xxx'
    },
    list: [1,2,3,4],
    date: new Date('2020-10-10')
  }, obj = {
    a: 1,
    obj: {
      name: 'xxx'
    },
    list: [1,2,3,4],
    date: new Date('2020-10-10')
  }

  const c = new Observer(obj, (watcher) => {

    watcher((newValue, oldValue) => {
      expect(newValue).toEqual({
        a: '333',
        obj: {
          name: 'yyy',
          ooo: 'ooo'
        },
        list: [1,2,3,4,{name: 111},{lala: 111}],
        date: new Date('2020-10-10')
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

test('watch unchanged', (done) => {
  var obj = {
    a: 1
  }
  var count = 1

  const c = new Observer(obj, (watcher) => {

    watcher('a', (newValue, oldValue) => {
      count = 2
    })

    setTimeout(() => {
      expect(count).toEqual(1)
      done()
    }, 10);
  })

  c.a = 1
})

test('watch changed', (done) => {
  var obj = {
    a: 1
  }
  var count = 1

  const c = new Observer(obj, (watcher) => {

    watcher('a', (newValue, oldValue) => {
      count = 2
    })

    setTimeout(() => {
      expect(count).toEqual(2)
      done()
    }, 10);
  })

  c.a = 'aaa'
})

// test('watch date', (done) => {
//   var obj = {
//     d: new Date('2020-10-10')
//   }

//   const c = new Observer(obj, (watcher) => {

//     watcher('d', (newValue, oldValue) => {
//       expect(newValue).toEqual(new Date('2020-10-11'))
//       expect(oldValue).toEqual(new Date('2020-10-10'))
//       done()
//     })
//   })

//   c.d = new Date('2020-10-11')
// })