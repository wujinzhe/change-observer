console.log(window.Observer)

var observer = new Observer({
  name: 111,
  arr: {
    a: [1, 2]
  }
}, (watcher) => {
  watcher('arr.a', (newValue, oldValue) => {
    console.log('arr.a', newValue, oldValue)
    // document.getElementById('text').innerText = newValue
    // document.getElementById('input').value = newValue
    // document.getElementById('input1').value = newValue
  })
})

document.getElementById('input').addEventListener('input', function(e) {
  // observer.name = this.value
  observer.arr.a[0] = this.value
})

// document.getElementById('input1').addEventListener('input', function(e) {
//   observer.name = this.value
// })