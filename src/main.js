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
// 注册商品分类的树形表格插件
Vue.component('tree-table', TreeTable)

// 导入添加商品的富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 注册添加商品的富文本编辑器
Vue.use(VueQuillEditor)

// 导入nprogress依懒包和对应的css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

// 设置请求拦截器,添加token
axios.interceptors.request.use(config => {
    // 展示进度条
    NProgress.start()

    // console.log(config)
    // 获取登录过后生成的token值,添加到axios请求头里面,这样每次请求都会自动携带
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

// 设置响应拦截器,在响应成功之后处理
axios.interceptors.response.use(config => {
    // 隐藏进度条
    NProgress.done()
    return config
})

// 全局注册格式化时间
Vue.filter('dataFormat', function(updTime) {
    var date = new Date(updTime)
    var yy = date.getFullYear()
    var mm = date.getMonth() + 1
    var dd = date.getUTCDate()
    var h = date.getHours()
    var h = h < 10 ? '0' + h : h
    var m = date.getMinutes()
    var m = m < 10 ? '0' + m : m
    var s = date.getSeconds()
    var s = s < 10 ? '0' + s : s
    return `${yy}-${mm}-${dd} ${h}:${m}:${s}`
})

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')