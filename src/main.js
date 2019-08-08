import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入商品分类的树形表格插件
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios;
// 设置请求拦截器,添加token
axios.interceptors.request.use(config => {
    // console.log(config);
    // 获取登录过后生成的token值,添加到axios请求头里面,这样每次请求都会自动携带
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
});
// 注册商品分类的树形表格插件
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')