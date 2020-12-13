import {db} from '@/firebase/firebase'

export default {
	state: {
		room: {},
		myRooms: []
	},
	getters: {
		room: state => state.room,
		myRooms: state => state.myRooms,
	},
	mutations: {
		room: (state, room) => state.room = room,
		myRooms: (state, myRooms) => state.myRooms = myRooms,
	},
	actions: {
		room({commit}, id) {
			db.collection('rooms').doc(id).get().then(doc => {
				commit('room', {...doc.data(), id: doc.id});
			})
		},
		myRooms({commit, getters}) {
			db.collection('rooms').where("modID", "==", getters.user.docID).onSnapshot(querySnapshot => {
				let myRooms = [];
				querySnapshot.forEach(doc => {
					myRooms.push({...doc.data(), id: doc.id})
				})
				commit('myRooms', myRooms);
			})
		}
	}
}