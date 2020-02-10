import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/users/users.vue'
import Roles from '../components/power/roles.vue'
import Rights from '../components/power/rights.vue'
import Goods from '../components/shop/goods.vue'
import Params from '../components/shop/params.vue'
import Categories from '../components/shop/categories.vue'
import Orders from '../components/order/orders.vue'
import Reports from '../components/report/reports.vue'
import addGoods from '../components/shop/addGoods.vue'
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
      component: Home,
      redirect:'/welcome',
      children:[
        {path:'/welcome',component:Welcome},
        {path:'/roles',component:Roles},
        {path:'/users',component:Users},
        {path:'/rights',component:Rights},
        {path:'/goods',component:Goods},
        {path:'/params',component:Params},
        {path:'/categories',component:Categories},
        {path:'/orders',component:Orders},
        {path:'/reports',component:Reports},
        {path:'/goods/add',component:addGoods}
      ]
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
