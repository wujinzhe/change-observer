const Observer = require('../dist/observer.js')

test('should normal', () => {
  const c = new Observer({
    a: 1,
    b: 2,
    list: [1,2,3,4]
  }, (watcher) => {
    // console.log('watcher', watcher)
    watcher('a', (newValue, oldValue) => {
      expect(oldValue).toEqual(1)

      expect(newValue).toEqual(123)
    })
  
    watcher('list', (newValue, oldValue) => {
      expect(oldValue).toEqual([1,2,3,4])

      expect(newValue).toEqual([4,2,3,4,{name: 111}])
    })

    watcher((newValue, oldValue) => {
      expect(oldValue).toEqual({
        a: 1,
        b: 2,
        list: [1,2,3,4]
      })

      expect(newValue).toEqual({
        a: 123,
        b: [1,1,1],
        list: [4,2,3,4,{name: 111}]
      })
      // console.log('list =====')
      // console.log('newValue', newValue)
      // console.log('oldValue', oldValue)
    })


  })
  
  c.a = 11
  c.a = 123 // set
  c.list[0] = 4 // get list  这个时候应该list需要为proxy
  c.list.push({name: 111})
  c.list = c.list.concat([{lala: 111}])
  c.b = [1,1,1]

  setTimeout(() => {
    c.a = 456
  }, 500);
})

test('should sync', () => {
  const c = new Observer({
    a: 1,
    b: 2,
    list: [1,2,3,4],
    obj: {
      a: 1,
      b: 2,
      c: 3,
      list: {}
    }
  }, (watcher) => {
    // console.log('watcher', watcher)
    watcher('a', (newValue, oldValue) => {
      expect(oldValue).toEqual(1)

      expect(newValue).toEqual(456)
    })
  
    watcher('list', (newValue, oldValue) => {
      expect(oldValue).toEqual([1,2,3,4])

      expect(newValue).toEqual([1,2,3,4,123])
    })

    watcher((newValue, oldValue) => {
      expect(oldValue).toEqual({
        a: 1,
        b: 2,
        list: [1,2,3,4]
      })

      expect(newValue).toEqual({
        a: 456,
        b: 2,
        list: [1,2,3,4,123]
      })
    })
  })

  setTimeout(() => {
    c.a = 456
    c.list.push(123)
  }, 500);
})

test('should obj', () => {
  const c = new Observer({
    obj: {
      a: 1,
      b: 2,
      c: 3
    }
  }, (watcher) => {
    watcher('obj', (newValue, oldValue) => {
      expect(oldValue).toEqual({
        a: 1,
        b: 2,
        c: 3
      })

      expect(newValue).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 4
      })

    })

    watcher('d', (newValue, oldValue) => {
      expect(oldValue).toEqual(undefined)

      expect(newValue).toEqual(4)

    })

    watcher((newValue, oldValue) => {
      expect(oldValue).toEqual({
        obj: {
          a: 1,
          b: 2,
          c: 3
        }
      })

      expect(newValue).toEqual({
        obj: {
          a: 1,
          b: 2,
          c: 3,
          d: 4
        },
        d: 4
      })
    })
  })

  c.obj.d = 4
  c.d = 4

})