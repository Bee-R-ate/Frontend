import Vue from 'vue'
import Vuex from 'vuex'

import Auth from '@/store/modules/auth/auth'
import Snackbar from '@/store/modules/snackbar/snackbar'
import Loading from '@/store/modules/loading/loading'
import Friends from '@/store/modules/friends/friends'
import Beers from '@/store/modules/beers/beers'
import Room from '@/store/modules/room/room'

Vue.use(Vuex)

export default new Vuex.Store({
	modules:{
		Auth, Snackbar, Loading, Friends, Beers, Room
	}
})