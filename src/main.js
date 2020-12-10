import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import store from './store'
import { firestorePlugin } from 'vuefire'
import vuetify from './plugins/vuetify';

Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  vuetify,
  store
}).$mount('#app')
