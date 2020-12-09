Page({
  data: {
    a: 1,
    name: '11',
    addressList: [],
    obj: {
      name: 11
    }
  },

  watcher: {
    'name': (newValue, oldValue) => {
      console.log('name')
      console.log('newValue', newValue)
      console.log('oldValue', oldValue)
    },

    'addressList': (newValue, oldValue) => {
      console.log('addressList', newValue, oldValue)
    },

    'obj': (newValue, oldValue) => {
      console.log('obj')
      console.log('newValue', newValue)
      console.log('oldValue', oldValue)
    }
  },

  onLoad() {
    console.log('页面')
  },

  change() {
    this.setData({
      'name': (Math.random() * 10000).toFixed(0),
      'addressList': [111]
    })
  },

  change1() {
    this.setData({
      'name': (Math.random() * 10000).toFixed(0),
      'obj.name': (Math.random() * 10000).toFixed(0),
    })
  },

  next() {
    console.log(this, this.data)
  //   wx.navigateTo({
  //     url: '/pages/other/index'
  //   })
  }
});