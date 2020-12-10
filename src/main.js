import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import store from './store/store'
import { firestorePlugin } from 'vuefire'
import vuetify from './plugins/vuetify';
import {db} from './firebase/firebase'

Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
	render: h => h(App),
	router,
	vuetify,
	store,
	firestore: {
		users: db.collection('users')
	},
}).$mount('#app')
