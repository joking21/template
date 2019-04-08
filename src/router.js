import Vue from 'vue'
import Router from 'vue-router'
import store from './store';
import PageMyTask from './views/PageMyTask';
import PageIndexBaseManage from './views/PageIndexBaseManage';
import PageTemplateManage from './views/PageTemplateManage';
import PageTaskSet from './views/PageTaskSet';
import PageTaskManagement from './views/PageTaskManagement';
import PageReportAnalysis from './views/PageReportAnalysis';
import PageLogin from './views/PageLogin';

Vue.use(Router)
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'PageMyTask',
      component: PageMyTask,
      meta: {
        keepAlive: true,
        requireAuth: true
      }
    },
    {
      path: '/login',
      name: 'PageLogin',
      component: PageLogin,
      meta: {
        keepAlive: false,
        requireAuth: false,
      }
    },
    {
      path: '/indexBaseManage',
      name: 'PageIndexBaseManage',
      component: PageIndexBaseManage,
      meta: {
        keepAlive: true,
        requireAuth: true
      }
    },
    {
      path: '/templateManage',
      name: 'PageTemplateManage',
      component: PageTemplateManage,
      meta: {
        keepAlive: true,
        requireAuth: true
      }
    },
    {
      path: '/taskSet',
      name: 'PageTaskSet',
      component: PageTaskSet,
      meta: {
        keepAlive: true,
        requireAuth: true
      }
    },
    {
      path: '/taskManagement',
      name: 'PageTaskManagement',
      component: PageTaskManagement,
      meta: {
        keepAlive: true,
        requireAuth: true
      }
    },
    {
      path: '/reportAnalysis',
      name: 'PageReportAnalysis',
      component: PageReportAnalysis,
      meta: {
        keepAlive: true,
        requireAuth: true
      }
    },
  ]
});

router.beforeEach((to, from, next) => {
  store.commit('changeLogin');
  if (to.meta.requireAuth) {
    if (store.state.token) {
      next();
    } else {
      next({
        path: '/login',
        //     query: {redirect:to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next();
  }
  if (!to.meta.requireAuth) {  //判断用户是否是在已登录的情况下，又直接连接到登录页面
    if (store.state.token) {
      next({
        path: '/',
      })
    } else {
      next();
    }
  }
});
export default router;
