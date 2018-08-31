Page.VM({
  data: {
    model: 'model'
  },
  methods: {

  },
  onLoad: function() {
    setTimeout(function(){
      console.log('JSON.stringify(this.$page.data)')
      console.log(JSON.stringify(this.$page.data,'', '  '))
    }.bind(this), 1000)
  }
})