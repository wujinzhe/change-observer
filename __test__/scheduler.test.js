import Scheduler from '../src/core/scheduler'

test('sync change', (done) => {
  var obj = {
    a: 1,
    b: [1, 2, 3],
    c: {
      name: 'xxx'
    }
  }

  const scheduler = new Scheduler(obj, ({ newValue, oldValue, paths }) => {
    expect(newValue).toEqual({
      a: 1,
      b: [1, 1000, 3],
      c: {
        name: 'aaaaa'
      }
    })
    expect(oldValue).toEqual(obj)
    expect(paths).toEqual(['c', 'b'])
    done()
  })

  scheduler.collect({
    newValue: 'aaaaa',
    oldValue: 'xxx',
    path: ['c', 'name']
  })

  scheduler.collect({
    newValue: 1000,
    oldValue: 2,
    path: ['b', '1']
  })
})

test('async change', (done) => {
  var obj = {
    a: 1,
    b: [1, 2, 3],
    c: {
      name: 'xxx'
    }
  }

  const scheduler = new Scheduler(obj, ({ newValue, oldValue, paths }) => {
    expect(newValue).toEqual({
      a: 1,
      b: [1, 1000, 1000],
      c: {
        name: 'aaaaa'
      }
    })
    expect(oldValue).toEqual(obj)
    expect(paths).toEqual(['c', 'b'])
    done()
  })

  setTimeout(() => {
    
    scheduler.collect({
      newValue: 'aaaaa',
      oldValue: 'xxx',
      path: ['c', 'name']
    })
  
    scheduler.collect({
      newValue: 1000,
      oldValue: 2,
      path: ['b', '1']
    })

    scheduler.collect({
      newValue: 1000,
      oldValue: 3,
      path: ['b', '2']
    })
  }, 1000);
})