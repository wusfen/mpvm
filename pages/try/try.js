var upper = function(){
  return 'is upper'
}
upper.isComputed = true
upper.toJSON = upper.toString = upper.valueOf = function(){
  return upper()
}

var options = {
  data: {
    model: 'model',
    upper: upper
  },
  upper: upper,
  onLoad: function () {
    Page.page = this
    this.data.upper = upper
    console.log(this.data.upper)
  }
}

Page(options)