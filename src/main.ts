import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { Http, base64ToBlob, eventBus } from '@/utils/index'
import AmapVue from '@amap/amap-vue';

Vue.config.productionTip = false
Vue.prototype.$http = new Http()
Vue.prototype.base64ToBlob = base64ToBlob;
Vue.prototype.createObjectURL = window.URL.createObjectURL;

AmapVue.config.version = '2.0'; // 默认2.0
AmapVue.config.key = '6f658bc4907e5f24b9e429b9311314c6';
(AmapVue.config.plugins as any) = [
  'AMap.ToolBar',
  'AMap.MoveAnimation',
  'AMap.Walking',
  'AMap.Driving',
  'AMap.DragRoute'
  // 配置需要预加载的插件，如果不配置，在使用到的时候会自动异步加载
];
Vue.use(AmapVue);
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
