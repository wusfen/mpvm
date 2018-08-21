var vm = new Page.vm({
  data: {
    model: 'vmm',
    obj: {
      key: 'value',
    },
    arr: [
      { id: 11, name: 'n1' },
      { id: 2222, name: 'n2' }
    ],
    data: 'ov:data'
  },
  computed:{
    total: function () {
      return this.model+': '+String(vm.model).length
      return Math.random()
    },
  },
  methods: {
    fun: function (e) {
      vm.model = e
      vm.obj.key = 'funk'
    },
    click: function (e) {
      vm.fun(e)
      console.log(vm)
    },
  },
  mounted: function () {
    vm.model = vm.route
  }
})
