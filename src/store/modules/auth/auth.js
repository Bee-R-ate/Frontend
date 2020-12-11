export default {
	state: {
		user: {}
	}, 
	mutations: {
		user: (state, user) => state.user = user,
		signOut: state => state.user = {}
	}, 
	getters: {
		user: state => state.user
	}, 
}