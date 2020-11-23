import Vue from 'vue'
import Router from 'vue-router'
import store from '@/components/store/store'
Vue.use(Router)
const loginPath='/home/login'
const router=new Router({
  routes: [
    {
      path: '/',
      redirect: '/home/msgList'
    },
    {
      path: '/home',
      component: () => import('@/components/page/home.vue'),
      meta:1,
      children: [
        {
          path: '/home/friendList/dialog/:friendId/:srcType',
          component: () => import('@/components/page/dialog.vue'),
          meta:3,
        },
        {
          path: '/home/friendList',
          component: () => import('@/components/page/friendList.vue'),
          meta:{isShowBottom:true},
        },
        {
          path: '/home/msgList',
          component: () => import('@/components/page/msgList.vue'),
          meta:{isShowBottom:true},
        },
        {
          path: '/home/login',
          component: () => import('@/components/page/login.vue'),
          meta:2,
        },
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  // console.log(to.path)
  const nextRoute = [loginPath] // 白名单页面
  let access_token = localStorage.getItem("im:access_token")
  // 未登录状态；当路由到 nextRoute 指定页时，跳转至 UserLogIn
  if (nextRoute.indexOf(to.path) < 0 && !access_token) { // 检测是否登录的页面
    next({
      path: loginPath,
      query: {
        redirect: to.path
      }
    })
    return
  }
  let routeArr=to.path.split('/').filter(str=>{return !!str})
  if(to.meta.isShowBottom===true){
    store.commit('setShowBottomFlag', true)
  }else{
      store.commit('setShowBottomFlag', false)
  }
  let bottomLabel=routeArr[1]
  store.commit('setBottomLabel',bottomLabel)
  next() 
})
export default router