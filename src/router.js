import Vue from 'vue'
import Router from 'vue-router'
// import PageMyTask from './views/PageMyTask.vue';
import PageIndexBaseManage from './views/PageIndexBaseManage.vue';
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: PageIndexBaseManage
    }
  ]
})
