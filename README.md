# mpvm
微信小程序轻量框架（类Vue语法）

主要对逻辑层进行改造封装


## 逻辑层

成员函数内的`this`指向`data`作为`vm`, 并且`computed` `methods`的成员也通过`this`访问

在成员函数内，直接通过`this`修改数据即可，无须`this.setData`，框架会自动更新视图

`Page.vm()`返回`this`，可以在成员函数内使用变量名（如`vm`）代替`this`

`mounted`映射为`onLoad`

解决了小程序原生不能把数据改成`undefined`的缺陷

```javascript
var vm = Page.vm({
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

## 视图层
因为框架非常轻量，视图层没有多大变化

小程序事件处理函数并不支持直接传参，只能通过`event.target.dataset`的方法传递参数，比较麻烦

本框架做了个语法糖，如果存在`data-arg`时，其值将做为事件处理函数的第一个参数

```html
{{model}} -> {{upper}}
<button bind:tap="change" data-arg="{{'my world'}}">change</button>
```
即相当于点击时
```javascript
vm.change('my world')
```

需要注意的是：

小程序的`dataset`传递的参数是原数据的一个副本，所以传参为对象类型时，并不能与原数据通过`==`判断相等

这是小程序底层实现所决定的，这应该是底层设计存在缺陷

但是你可以通过对象的唯一字段再去查找

## 使用方法

1. 在入口文件`app.js`中引入`mpvm.js`
```javascript
require('./mpvm.js')
```
2. 在具体页面的js中直接使用即可
```javascript
Page.vm(options)
```




