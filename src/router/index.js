import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import '../assets/css/global.css'
import '../plugins/element.js'

import Element from 'element-ui'
Vue.prototype.$message = Element.Message
Vue.use(Element)

Vue.use(VueRouter)


const router = new VueRouter({
  routes:[
    {
      path: '/'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    }
  ]
})
router.beforeEach((to,form,next)=>{
  if(to.path==='/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr){next('/login');Element.Message.error('非法访问，请登录后再试');}
  else{next()}
})
export default router
