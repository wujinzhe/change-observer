console.log(window.Observer)

var observer = new Observer({
  name: 111
}, (watcher) => {
  watcher('name', (newValue) => {
    document.getElementById('text').innerText = newValue
    document.getElementById('input').value = newValue
    document.getElementById('input1').value = newValue
  })
})

document.getElementById('input').addEventListener('input', function(e) {
  observer.name = this.value
})

document.getElementById('input1').addEventListener('input', function(e) {
  observer.name = this.value
})