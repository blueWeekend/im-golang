import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/friendList',
      component: () => import('@/components/friendList.vue')
    },
    {
      path: '/home',
      component: () => import('@/components/home.vue'),
      meta:1,
      children: [
        {
          path: '/home/friendList/dialog',
          component: () => import('@/components/dialog.vue'),
          meta:3,
        },
        {
          path: '/home/friendList',
          component: () => import('@/components/friendList.vue'),
          meta:2,
        },
        {
          path: '/home/msgList',
          component: () => import('@/components/msgList.vue'),
          meta:2,
        },
      ]
    }
  ]
})
