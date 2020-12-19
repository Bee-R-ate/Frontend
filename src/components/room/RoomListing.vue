<template>
	<div class="d-flex justify-center room-listing home-container ">
		<div class="home-content position-relative">
			<div class="back-container">
				<v-btn link to="/" icon>
					<v-icon>mdi-arrow-left-circle</v-icon>
				</v-btn>
			</div>
			<h2 class="home-title">Moje pokoje</h2>
			
			<v-list v-if="rooms.length > 0" class="py-0 mt-3 friend-list">
				<div v-for="(room, i) in rooms" :key="i">
					<router-link :to="roomsData[i] ? (roomsData[i].inProgress ? `/rozgrywka/${room}` : `/pokoj/${room}`) : ''">
						<v-list-item class="px-0">

							<v-list-item-content class="pa-5">
								<div class="">
									<v-list-item-title v-html="roomsData[i] ? roomsData[i].name : ''"></v-list-item-title>
								</div>
								<div class="delete-friend-container">
									<div>
										<v-btn v-if="roomsData[i] ? roomsData[i].modID == user.docID : false" small-x class="" @click="deleteRoom(room, i)" icon>
											<v-icon>mdi-close</v-icon>
										</v-btn>
									</div>
								</div>
							</v-list-item-content>
						</v-list-item>
						<v-divider v-if="i != rooms.length - 1"></v-divider>
					</router-link>
				</div>
			</v-list>
			<div class="mt-3" v-else>
				Nie masz w tej chwili pokojów. <br><router-link to="/tworzenie-pokoju">Kliknij, aby stworzyć pokój!</router-link>
			</div>

			
		</div>
	</div>
</template>

<script>
	import {db} from '@/firebase/firebase'
	
	export default {
		data() {
			return {
				roomsData: []
			}
		},
		watch: {
			rooms() {
				this.getRoomsData()
			},
		},
		computed: {
			rooms() {
				return this.$store.getters.user.myRooms == undefined ? [] : this.$store.getters.user.myRooms;
			},
			user() {
				return this.$store.getters.user;
			}
		},
		methods: {
			async deleteRoom(room, i) {
				if(!confirm('Czy na pewno chcesz usunąć pokój? Osoby znajdujące się w nim zostaną tam na zawsze!')) return;

				this.$store.commit('loading', true);
				this.roomsData[i].participants.forEach(async participant => {
					await db.collection('users').doc(participant.userID).get().then(async doc => {
						let myRooms = doc.data().myRooms;
						myRooms.splice(myRooms.indexOf(room), 1);
						await db.collection('users').doc(participant.userID).update({myRooms});
					})
				})

				await db.collection('rooms').doc(room).delete().then(() => {
					this.$store.commit('loading', false);
					this.$store.commit('snackbar', 'Pomyślnie usunięto pokój!');

				}).catch(() => {
					this.$store.commit('loading', false);
					this.$store.commit('snackbar', 'Przepraszamy, błąd serwera...');
				})
			},
			getRoomsData() {
				if(this.rooms.length > 0) {
					this.rooms.forEach(async room => {

						let promise = await db.collection('rooms').doc(room).get();
						let data = {...promise.data(), id: promise.id}
						if(this.roomsData.indexOf(data) == -1) this.roomsData.push(data);
					})
				}
			}
		},
		created() {
			this.getRoomsData()
		}
		
	}
</script>

<style>
	.room-listing .back-container{
		top: -20%;
	}
</style>