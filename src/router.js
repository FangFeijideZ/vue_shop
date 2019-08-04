import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/Users.vue'
Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [{
                path: '/welcome',
                component: Welcome
            }, {
                path: '/users',
                component: Users
            }]
        }
    ]
});
// 挂载路由守卫,根据是否有token来判断是否可以进入主页(如果登录成功后台就会返回一个token,相反就没有)
router.beforeEach((to, from, next) => {
    // 如果是在登录界面就直接放行到下一个
    if (to.path == '/login') {
        return next()
    } else {
        // 如果不是在登录界面,就本地存储有没有token(就是看有没有登录过,登录过就有token),没有就跳转到login登录
        const token = window.sessionStorage.getItem('token');
        if (!token) {
            return next('/login')
        };
        // 跳转到login登录界面后,可以执行放行到下一个,这个一定要写,不然页面无法正常跳转
        next()
    }
})
export default router