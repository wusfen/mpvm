var vm = Page.vm({
  // 数据
  data: {
    model: 'mpvm.js'
  },
  // 计算属性
  computed: {
    upper: function () {
      return this.model.toUpperCase()
    }
  },
  // 方法
  methods: {
    change: function (name) {
      this.model = 'hello ' + (name || 'world')
    }
  },
  // onLoad
  mounted: function () {
    vm.change()
  }
})