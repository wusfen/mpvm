var vm = new global.VM({
  data: {
    model: 'model'
  },
  methods: {
    change() {
      this.model = 'change model'
    }
  },
  onLoad: function () {
    vm.model = 'model2'

    setInterval(() => {
      console.log('setInterval')
      vm.model += '.'
    }, 1000)
  }
})