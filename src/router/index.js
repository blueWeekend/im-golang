import Vue from 'vue'
import Router from 'vue-router'
import store from '@/components/store/store'
import {getToken} from '@/utils/global'
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
          path: '/home/friendList/dialog/:targetId/:srcType',
          component: () => import('@/components/page/dialog.vue'),
          meta:3,
        },
        {
          path: '/home/friendList',
          component: () => import('@/components/page/friendList.vue'),
          meta:{
            isShowCommonUnit:true,
          },
        },
        {
          path: '/home/msgList',
          component: () => import('@/components/page/msgList.vue'),
          meta:{
            isShowCommonUnit:true,
          },
        },
        {
          path: '/home/login',
          component: () => import('@/components/page/login.vue'),
          meta:2,
        },
        {
          path: '/home/nearby',
          component: () => import('@/components/page/nearby.vue'),
          meta:{
            isShowCommonUnit:true,
          },
        },
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  // console.log(to.path)
  const nextRoute = [loginPath] // 白名单页面
  let access_token = getToken()
  
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
  store.commit('setShowCommonUnitFlag', to.meta.isShowCommonUnit===true?true:false)
  let bottomLabel=routeArr[1]
  store.commit('setBottomLabel',bottomLabel)
  if(routeArr[routeArr.length-1]=='home'){
    next({
      path: '/home/msgList'
    })
  }
  next() 
})
export default router