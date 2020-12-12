import {fb, db} from '@/firebase/firebase'
import firebase from 'firebase'

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

	actions: {
		editUser({commit, state}, userData) {
			commit('loading', true);
			if(userData.file != null) {
				const storageRef = fb.storage().ref(`avatars/${state.user.docID}/${userData.file.name}`);
				const uploadTask = storageRef.put(userData.file);

				uploadTask.on('state_changed', snapshot=>console.log(snapshot), error=>console.log(error), ()=>{
					uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
						db.collection('users').doc(state.user.docID).update({ImageURL: downloadURL}).then(() => {
							commit('snackbar', 'Pomyślnie dodano zdjęcie!');
							commit('loading', false);
						}).catch(() => {
							commit('snackbar', 'Błąd serwera, przepraszamy...');
							commit('loading', false);
						});
					});
				});
			}

			if(userData.newPassword) {
				let user = firebase.auth().currentUser;
				const credentials = firebase.auth.EmailAuthProvider.credential(user.email, userData.oldPassword);

				user.reauthenticateWithCredential(credentials).then(() => user.updatePassword(userData.newPassword).then(() => {
					commit('snackbar', 'Pomyślnie zmieniono hasło!');
					commit('loading', false);
				})).catch(error => {
					if(error.code == "auth/wrong-password") {
						commit('snackbar', 'Podano nieprawidłowe hasło!');
						commit('loading', false);
						return;
					}
				});
			}

			db.collection('users').doc(state.user.docID).update({Name: userData.name}).then(() => {
				commit('snackbar', 'Pomyślnie edytowano nazwę!');
				commit('loading', false);
			});

		}
	}
}