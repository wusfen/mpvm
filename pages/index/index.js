var vm = new Page.vm({
  data: {
    model: 'mpvm'
  },
  computed:{
    upper: function () {
      return this.model.toUpperCase()
    }
  },
  methods: {
    change: function (name) {
      this.model = 'hello ' + (name || 'world')
    }
  },
  mounted: function () {
    vm.change()
  }
})
