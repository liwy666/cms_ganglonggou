# cms_ganglonggou

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

##商品基本信息编辑20190423
商品主图上传，并生成缩略图

##跨域上传失败?
   后端需处理OPTIONS预请求，（本次请求不会包含实际数据，）并返回200。之后前端才会发送正式请求，后端对这次请求才做正式处理
   （使用 OPTIONS 方法发起一个预检请求，以检测实际请求是否可以被服务器所接受。预检请求报文中的 Access-Control-Request-Method 首部字段告知服务器实际请求所使用的 HTTP 方法；Access-Control-Request-Headers 首部字段告知服务器实际请求所携带的自定义首部字段。服务器基于从预检请求获得的信息来判断，是否接受接下来的实际请求）
 
##分类列表完成
复制分类没做
查看分类下方商品有个bug
