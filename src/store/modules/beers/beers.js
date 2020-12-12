export default {
	state: {
		beers: []
	}, 
	mutations: {
		beers: (state, beers) => state.beers = beers,
	}, 
	getters: {
		beers: state => state.beers
	}, 
	actions: {
		async beers({commit, getters}) {
			let beers = [];
			for(let beer of getters.user.BeerList) {
				beers.push(beer);
			}
			commit('beers', beers);
		}
	}
}