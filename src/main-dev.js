import Vue from 'vue'
import axios from 'axios'
//导入进度条需要的包与css样式
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
axios.defaults.baseURL = 'http://47.95.210.221:3000/api/private/v1/'
//request拦截器 开启进度条
axios.interceptors.request.use(config =>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start()
  return config
})
//response拦截器 关闭进度条
axios.interceptors.response.use(config =>{
  NProgress.done()
  return config
})

Vue.prototype.$http = axios
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import Treetable from 'vue-table-with-tree-grid'
Vue.component('tree-table', Treetable)
//文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

Vue.filter('dateFormat',(originVal)=>{
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')
  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d}-${hh}:${mm}:${ss}`
});
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
