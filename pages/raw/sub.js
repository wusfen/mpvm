// console.log('raw/sub.js once')

var data = {
  model: 'model',
  toJSON: function () {
    console.log('toJSON this==data', this == data)
    return this
  }
}
var lastThis
var lastData

var page = Page({
  data: data,
  onLoad: function () {
    Page.app = getApp()
    Page.page = this

    console.log('this.data==data', this.data == data)
    console.log('this==lastThis', this == lastThis, this, lastThis)
    console.log('this.data==lastData', this.data == lastData, this.data, lastData)

    Page.lastThis = lastThis = this
    Page.lastData = lastData = this.data
  }
})
// console.log('raw/sub Page()', page)