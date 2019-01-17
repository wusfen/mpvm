var vm = new global.VM({
  abc: 1,
  data() {
    console.log('data', this)
    return {
      model: 'model',
      obj: {
        key: 'value'
      }
    }
  },
  computed: {
    upper() {
      return String(this.model).toUpperCase()
    }
  },
  methods: {
    getModel() {
      return this.model
    },
    change() {
      console.log(arguments)
      vm.model = 'new model'
    }
  },
  mounted() {
    console.log('mounted')
  }
})