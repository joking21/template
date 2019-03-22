import Vue from 'vue'
import Router from 'vue-router'
import PageMyTask from './views/PageMyTask.vue';
import PageIndexBaseManage from './views/PageIndexBaseManage.vue';
import PageTemplateManage from './views/PageTemplateManage.vue';
import PageTaskSet from './views/PageTaskSet.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'PageMyTask',
      component: PageMyTask
    },
    {
      path: '/indexBaseManage',
      name: 'PageIndexBaseManage',
      component: PageIndexBaseManage
    },
    {
      path: '/templateManage',
      name: 'PageTemplateManage',
      component: PageTemplateManage
    },
    {
      path: '/taskSet',
      name: 'PageTaskSet',
      component: PageTaskSet
    },
  ]
})
