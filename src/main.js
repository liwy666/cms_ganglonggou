import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Blob from './excel/Blob'
import Export2Excel from './excel/Export2Excel.js'

Vue.config.productionTip = false;

/*引入Element*/
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//引入axios
import {post, fetch, patch, put, imgUpload} from './http'
Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;
Vue.prototype.$imgUpload = imgUpload;


new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
