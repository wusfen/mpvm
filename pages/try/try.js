var upper = function(){
  return 'is upper'
}
upper.toJSON = upper.toString = upper.valueOf = function(){
  return upper()
}

var data = {
  model: 'model',
  upper: upper,
  $page: null
}

var options = {
  data: data,
  upper: upper,
  change: function () {
    data.model = Math.random()

    this.setData(data)

    console.log(JSON.stringify(this.data, 0, '   '))
  },
  onLoad: function () {
    Page.page = this
    
    data.$page = this
  }
}

Page(options)