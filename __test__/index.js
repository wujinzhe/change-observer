const Observer = require('../src/observer.js')
// console.log("Observer", Observer)

const c = new Observer({
  a: 1,
  b: 1,
  c: {
    a: 1,
    b: 1,
    c: [1,2,3,4]
  },
  list: [1,2,3,4]
}, (watcher) => {
  // console.log('watcher', watcher)
  // watcher('a', (newValue, oldValue) => {
  //   console.log('a', newValue)
  //   console.log('newValue', newValue)
  //   console.log('oldValue', oldValue)
  //   // expect(oldValue).toEqual(1)

  //   // expect(newValue).toEqual(123)
  // })

  // watcher('list', (newValue, oldValue) => {
  //   console.log('list')
  //   console.log('newValue', newValue)
  //   console.log('oldValue', oldValue)
  //   // expect(oldValue).toEqual([1,2,3,4])

  //   // expect(newValue).toEqual([4,2,3,4,{name: 111}])
  // })

  watcher((newValue, oldValue) => {
    console.log('newValue', newValue)
    console.log('oldValue', oldValue)
    // expect(oldValue).toEqual({
    //   a: 1,
    //   b: 2,
    //   list: [1,2,3,4]
    // })

    // expect(newValue).toEqual({
    //   a: 123,
    //   b: [1,1,1],
    //   list: [4,2,3,4,{name: 111}]
    // })
    // console.log('list =====')
    // console.log('newValue', newValue)
    // console.log('oldValue', oldValue)
  })


})

// c.a = 11
// c.a = 123 // set
// c.list[0] = 4 // get list  这个时候应该list需要为proxy
c.list.push({name: 111})
console.log('c', c.c.c[1])
// c.b = [1,1,1]
c.list = c.list.concat([{lala: 111}])

// setTimeout(() => {
//   c.a = 456
// }, 500);