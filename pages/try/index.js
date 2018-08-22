// pages/try/index.js
var  upper = function(){
  return Math.random()
}
upper.toJSON = function(){
  console.log('upper toJSON')
  setTimeout(function(){
    Page.page.setData({
      // upper: upper,
      model: Math.random(),
    })
  }, 500)
  return this()
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    model: 'model',
    upper: upper
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Page.page = this
  },

})