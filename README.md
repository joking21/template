# hello-world

## 安装依赖
```
npm install
```

### 启动项目
```
npm start
```

### 项目打包
```
npm run build
```

### 测试（不重要）
```
npm run test
```

### 修复代码（格式报错 --fix）运行这个命令
```
npm run lint
```

### 单元测试（不重要）
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
# 传勇需知

新建页面流程
1 新建文件
    页面都放在src/views文件夹（一个.vue 的文件template标签里面写html的代码，script写js的代码，style里面写css的代码）
2 配置新建路由
    再src/router里面新建，参照about.vue配置
    {
      path: '/about',页面访问的路径
      name: 'about',路由名字
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')把这个vue的文件引进来
    }
然后在 浏览器输入 http://localhost:8080/about就可以访问about这个页面


#关于图片
放在assets文件夹，用相对路径去取

#公共文件
header头和footer放在component文件夹下面的Common

#请求接口  
参照（util/request.js）方法重写
this.$post('url地址',' 参数' ,'成功函数', '失败函数');
this.$get('url地址',' 参数' ,'成功函数', '失败函数');
若请求接口是
GET /MeEvaluateTask/getTaskInfo/{id}
则 this.$get('url地址/id', null ,'成功函数', '失败函数')

