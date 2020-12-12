export default {
	state: {
		user: {}
	}, 
	mutations: {
		user: (state, user) => state.user = user,
		signOut: state => {state.user = {}; state.friends = []}
	}, 
	getters: {
		user: state => state.user
	}, 
}