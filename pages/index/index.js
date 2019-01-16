var vm = new global.VM({
  data() {
    console.log('data', this)
    return {
      model: 'model'
    }
  },
  computed: {
    upper() {
      return this.model.toUpperCase()
    }
  },
  methods: {
    getModel() {
      return this
    },
    change() {
      vm.model = 'new model'
    }
  },
  onLoad() {
    console.log(this)
  }
})