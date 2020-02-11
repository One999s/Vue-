import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')
const Users = () => import(/* webpackChunkName: "users_roles_rights" */ '../components/users/users.vue')
const Roles = () => import(/* webpackChunkName: "users_roles_rights" */ '../components/power/roles.vue')
const Rights = () => import(/* webpackChunkName: "users_roles_rights" */ '../components/power/rights.vue')

const Params = () => import(/* webpackChunkName: "params_cate" */ '../components/shop/params.vue')
const Categories = () => import(/* webpackChunkName: "params_cate" */ '../components/shop/categories.vue')

const Goods = () => import(/* webpackChunkName: "goods_add" */ '../components/shop/goods.vue')
const addGoods = () => import(/* webpackChunkName: "goods_add" */ '../components/shop/addGoods.vue')

const Orders = () => import(/* webpackChunkName: "orders_reports" */ '../components/order/orders.vue')
const Reports = () => import(/* webpackChunkName: "orders_reports" */ '../components/report/reports.vue')



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
  if(!tokenStr){next('/login');Element.Message.error('请登录');}
  else{next()}
})
export default router
