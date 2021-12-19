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
  },
  {
    path: '/register', // 注册
    name: 'Register',
    component: Register,
  },
  {
    path: '/home', // 首页
    name: 'Home',
    component: Home,
  },
  {
    path: '/plan', // 旅游计划
    name: 'Plan',
    component: Plan,
  },
  {
    path: '/sight', // 景点批注
    name: 'Sight',
    component: Sight,
  },
  {
    path: '/intercourse', // 交友
    name: 'Intercourse',
    component: Intercourse,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: '/journal', // 游记
    name: 'Journal',
    component: Journal,
  },
  {
    path: '/guide', // 导游
    name: 'Guide',
    component: Guide,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
