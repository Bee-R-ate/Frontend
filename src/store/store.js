import Vue from 'vue'
import Vuex from 'vuex'

import Auth from '@/store/modules/auth'
import Snackbar from '@/store/modules/snackbar'

Vue.use(Vuex)

export default new Vuex.Store({
	modules:{
		Auth, Snackbar
	}
})