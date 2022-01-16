import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Http from '@/utils'
import { base64ToBlob } from "@/utils/blobToBase64";

Vue.config.productionTip = false
Vue.prototype.$http = new Http()
Vue.prototype.base64ToBlob = base64ToBlob;
Vue.prototype.createObjectURL = window.URL.createObjectURL;
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
