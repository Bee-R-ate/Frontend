<template>
	<div class="d-flex align-center justify-center home-container">
		<div class="home-content position-relative">
			<div class="back-container">
				<v-btn link to="/" icon>
					<v-icon>mdi-arrow-left-circle</v-icon>
				</v-btn>
			</div>
			<h2 class="home-title">Moi znajomi</h2>
			<v-text-field class="pa-3 pb-1 mt-0 friends-search" color="black" label="Wpisz email" prepend-icon="mdi-magnify" v-model="search"></v-text-field>
			<v-btn style="width: 100%" @click="addFriend" class="mt-2 mb-3" color="secondary">Dodaj znajomych! </v-btn>

			<v-list v-if="user.Friends.length > 0" two-line>
				<div v-for="(friend, i) in user.Friends" :key="i">
					<v-list-item>
						<v-list-item-avatar>
							<!-- <v-img :src="friendPhoto(friend)"></v-img> -->
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title v-html="friendName(friend)"></v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-divider></v-divider>
				</div>
			</v-list>
			<div v-else>
				Nie masz w tej chwili znajomych, trochę smutek.
			</div>

		</div>
	</div>
</template>

<script>
	import {db} from '@/firebase/firebase'
	import getOne from '@/helpers/firestore/collection.js'

	export default {
		data() {
			return {
				search: 'd.lewicki@adawards.pl',
				select: ''
			}
		},
		computed: {
			user() {
				return this.$store.getters.user;
			},
		},
		methods: {
			itemText: item => item.Email,
			async friendName(friend) {
				let name = await getOne('users', friend);
				console.log(name.Name)
				return await name.Name;
			},
			addFriend() {
				if(this.search.toLowerCase() == this.$store.getters.user.email.toLowerCase()) {
					this.$store.commit('snackbar', 'Myślałem, że brak znajomych to smutek, ale zapraszanie samego siebie... ;)');
					return;
				}
				db.collection("users").where('Email', '==', this.search.toLowerCase()).limit(1)
				.get().then(querySnapshot  => {
					querySnapshot.forEach(doc => {
						if(!this.user.Friends.includes(doc.id)) {
							this.user.Friends.push(doc.id);
							db.collection('users').doc(this.user.docID).update({Friends: this.user.Friends}).then(() => this.$store.commit('snackbar', 'Dodano znajomego!'));
						} else {
							this.$store.commit('snackbar', 'Już masz tego znajomego. Dodanie go drugi raz nie sprawi, że będzie Cię lubił bardziej...')
						}
					})
					
					
				});
			},
			
			
		},
	}
</script>

<style>
	.friends-search .v-text-field__details {
		display: none!important;
	}
</style>