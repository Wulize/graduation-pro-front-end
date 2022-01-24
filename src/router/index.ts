import VueRouter, { RouteConfig } from 'vue-router'
import Vue from 'vue'

const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Home = () => import('../views/Home.vue')
const Plan = () => import('../views/Plan.vue')
const Sight = () => import('../views/Sight.vue')
const Intercourse = () => import('../views/Intercourse.vue')
const Journal = () => import('../views/Journal.vue')
const Guide = () => import('../views/Guide.vue')

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/', // 默认登录页
    redirect: '/login',
  },
  {
    path: '/login', // 登录
    name: 'Login',
    component: Login,
    meta: {
      keepAlive: false, // 不需要缓存
    },
  },
  {
    path: '/register', // 注册
    name: 'Register',
    component: Register,
    meta: {
      keepAlive: false, // 不需要缓存
    },
  },
  {
    path: '/home', // 首页
    name: 'Home',
    component: Home,
    meta: {
      keepAlive: true, // 不需要缓存
    },
  },
  {
    path: '/plan', // 旅游计划
    name: 'Plan',
    component: Plan,
    meta: {
      keepAlive: false, // 不需要缓存
    },
  },
  {
    path: '/sight', // 景点批注
    name: 'Sight',
    component: Sight,
    meta: {
      keepAlive: false, // 不需要缓存
    },
  },
  {
    path: '/intercourse', // 交友
    name: 'Intercourse',
    component: Intercourse,
    meta: {
      authRequired: true,
      // 下行代码为true的时候，该模块常驻内存
      keepAlive: true,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: '/journal', // 游记
    name: 'Journal',
    component: Journal,
    meta: {
      keepAlive: false, // 不需要缓存
    },
  },
  {
    path: '/guide', // 导游
    name: 'Guide',
    component: Guide,
    meta: {
      keepAlive: false, // 不需要缓存
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})
// 路由守卫，next()表示跳转，next('/login')表示跳到login路由的判断条件
// router.beforeEach((to, from, next) => {
//   // 不是登录的话判断有没有权限，这里用sessionStorage的用户名作为表示
//   // 登录之后都会有这个用户名，如果没有就跳到登录
//   // 登录首先会判断cookie是否存在，存在的话直接跳到home，并且设置sessionStorage的用户名
//   if (to.path !== "/login" && to.path !== "/register") {
//     if (sessionStorage.getItem("userName")) {
//       return next()
//     } else {
//       return next('/login')
//     }
//   } else {
//     return next()
//   }
// })
export default router
