import Vue from 'vue'
import './plugins/axios'
import router from './router'
import './plugins/element.js'
/* 挂载全局应用容器 */
import App from './App'
/* 导入全局样式表 */
import '../public/global.css'
/* 导入echarts */
import echarts from 'echarts'
/* 导入网络请求库 axios */
import axios from 'axios'
// 将 echarts 绑定到全局对象的 prototype 上, 所有组件均可通过 `this.$echarts` 访问 echarts 对象
Vue.prototype.$echarts = echarts
// 将 axios 绑定到全局对象的 prototype 上, 所有组件均可通过 `this.$http` 访问 axios 对象
Vue.prototype.$http = axios
// axios 配置请
axios.defaults.baseURL = 'http://localhost:9000'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
