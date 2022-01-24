import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Http from '@/utils/http'
import GetSight from '@/utils/sight'
import Journal from '@/utils/journal'

Vue.config.productionTip = false
Vue.prototype.$http = new Http()
Vue.prototype.$getSight = new GetSight()
Vue.prototype.$journal = new Journal()
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
