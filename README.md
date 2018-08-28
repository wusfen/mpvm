# mpvm
微信小程序轻量框架（类Vue语法）


## 逻辑层

```javascript
var vm = Page.VM({
  // 数据
  data: {
    model: 'mpvm.js'
  },
  // 计算属性
  computed: {
    upper: function(){
      return this.model.toUpperCase()
    }
  },
  // 方法
  methods: {
    change: function(name){
      this.model = 'hello ' + (name || 'world')
    }
  },
  // onLoad
  mounted: function(){
    vm.change()
  }
})
```

### this

成员函数内的`this`指向`data`作为`vm`, 并且`computed` `methods`的成员也通过`this`访问

### 无须setData

直接通过`this`修改数据即可，无须`this.setData`，框架会自动更新视图

`Page.VM()`返回`this`，可以在成员函数内使用变量名（如`vm`）代替`this`

解决了小程序原生不能把数据改成`undefined`的缺陷

### mounted

`mounted`映射为`onLoad`

### 控制台

在开发工具控制台可以通过`Page.vm`访问当前页面的`vm`，方便调试

```javascript
Page.vm.model = 'new model'
```

通过`Page.page`可以访问原生的`page`实例


## 视图层
因为框架比较轻量，视图层没有多大变化

```html
{{model}} | {{upper}}
<button bind:tap="change" data-e="{{'my world'}}">change</button>
```
`data-e`将作为`change`的参数
```javascript
vm.change('my world')
```

小程序事件处理函数不能直接传参，有且只有事件对象作为参数，
但要传递参数时只能能过`data-x="{{'value'}}"`，然后`event.target.dataset`的方式获取

所以，为了方便，本框架将`dataset`作为第二个参数传给处理处理函数

另外，实际上大多数情况我们并不会用到`event`，所以，本框架做了另外一个语法糖，如果存在`data-e`时，将代替`event`直接作为处理函数的参数
```javascript
handler(dataset.e||event, dataset)
```


注意：

小程序的`dataset`传递的参数是原数据的一个**副本**，所以传参为对象类型时，并**不能**与原数据通过`==`相等

这是小程序底层实现所决定的，这应该是底层设计存在缺陷

## 使用方法

1. 在入口文件`app.js`中引入[mpvm.js](https://github.com/wusfen/mpvm/blob/master/mpvm.js)
```javascript
require('./mpvm.js')
```
2. 在具体页面的js中直接使用即可
```javascript
Page.VM(options)
```




