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
  },
  computed:{
    total: function () {
      return vm.model+': '+String(vm.model).length
    },
  },
  methods: {
    fun: function (e) {
      vm.model = 'fun'
      vm.obj.key = 'funk'
    },
    click: function (e) {
      vm.model = e.target.id
    },
  },
  mounted: function () {
    vm.model = 'onLoad'
  }
})
