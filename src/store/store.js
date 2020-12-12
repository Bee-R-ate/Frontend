import Vue from 'vue'
import Vuex from 'vuex'

import Auth from '@/store/modules/auth/auth'
import Snackbar from '@/store/modules/snackbar/snackbar'
import Loading from '@/store/modules/loading/loading'
import Friends from '@/store/modules/friends/friends'
import Beers from '@/store/modules/beers/beers'

Vue.use(Vuex)

export default new Vuex.Store({
	modules:{
		Auth, Snackbar, Loading, Friends, Beers
	}
})