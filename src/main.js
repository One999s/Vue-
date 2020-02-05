import Vue from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config =>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import Treetable from 'vue-table-with-tree-grid'
Vue.component('tree-table', Treetable)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
