import Vue from 'vue'
import Router from 'vue-router'

// 路由懒加载
const Login = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ './components/Login.vue')
const Home = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ './components/Home.vue')
const Welcome = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')

const Users = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ './components/user/Users.vue')
const Rights = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ './components/power/Rights.vue')
const Roles = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ './components/power/Roles.vue')

const Categories = () =>
    import ( /* webpackChunkName: "Categories_Params" */ './components/goods/Categories.vue')
const Params = () =>
    import ( /* webpackChunkName: "Categories_Params */ './components/goods/Params.vue')

const List = () =>
    import ( /* webpackChunkName: "List_Add" */ './components/goods/List.vue')
const Add = () =>
    import ( /* webpackChunkName: "List_Add" */ './components/goods/Add.vue')

const Order = () =>
    import ( /* webpackChunkName: "Order_Report" */ './components/order/Order.vue')
const Report = () =>
    import ( /* webpackChunkName: "Order_Report" */ './components/report/Report.vue')

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Categories },
                { path: '/params', component: Params },
                { path: '/goods', component: List },
                { path: '/goods/add', component: Add },
                { path: '/orders', component: Order },
                { path: '/reports', component: Report }
            ]
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
            return next('/home')
        };
        // 如果没有跳转到login登录界面,说明有token,就可以执行放行到下一个,这个一定要写,不然页面无法正常跳转
        next()
    }
})
export default router