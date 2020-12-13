<template>
	<div class="d-flex justify-center home-container">
		<div class="home-content position-relative friends">
			<div class="back-container">
				<v-btn link to="/moje-pokoje" icon>
					<v-icon>mdi-arrow-left-circle</v-icon>
				</v-btn>
			</div>
			<h2 class="home-title mb-5 mt-2">{{ room.name }}</h2>

			<v-list  class="py-0 friend-list">
				<div v-for="(participant, i) in room.participants" :key="i">
					<v-list-item class="px-0">
						<v-list-item-avatar :size="60" class="ml-3">
							<v-img :src="participantsData[i] ? participantsData[i].imageURL : ''"></v-img>
						</v-list-item-avatar>

						<v-list-item-content class="position-relative ">
							<div class="pr-3 py-3 d-flex">
								<v-list-item-title v-html="participantsData[i] ? participantsData[i].name : ''"></v-list-item-title>
								<v-btn retain-focus-on-click :color="participant.isReady ? 'success' : '#E53935'">{{ participant.isReady ? 'Gotowy' : 'Nie gotowy' }}</v-btn>
							</div>
						</v-list-item-content>
					</v-list-item>
					<v-divider v-if="i != room.participants.length - 1"></v-divider>
				</div>
			</v-list>

			<v-btn :disabled="mod == undefined ? true : mod.isReady" class="mt-5" color="success" x-large @click="ready">Zgłoś gotowość!</v-btn>
			

		</div>
	</div>
</template>

<script>
	import {db} from '@/firebase/firebase'
	
	export default {
		data() {
			return {
				participantsData: [],
			}
		},
		watch: {
			'room.participants'() {
				if(this.room.participants.length > 0) {
					this.room.participants.forEach(async participant => {

						let promise = await db.collection('users').doc(participant.userID).get();
						let data = {...promise.data(), id: promise.id}
						if(this.participantsData.indexOf(data) == -1) this.participantsData.push(data);
					})
				}
			},
			room: {
				deep: true,
				handler() {
					if(this.room.modID == undefined) {
						this.$store.commit('snackbar', 'Niestety pokój został usunięty, ktoś chyba nie potrafi się dobrze bawić...');
						this.$router.push('/');
					}
				}
			}
		},
		computed: {
			room() {
				return this.$store.getters.room;
			},
			user() {
				return this.$store.getters.user;
			},
			mod() {
				return this.room.participants == undefined ? {} : this.room.participants.find(user => user.userID == this.user.docID);
			}
			
		},
		methods: {
			ready() {
				let participants = this.room.participants;
				participants[participants.indexOf(participants.find(participant => participant.userID == this.user.docID))].isReady = true;
				db.collection('rooms').doc(this.room.id).update({participants})
			}
		},
		created() {
			this.$store.dispatch('room', this.$route.params.id);
		}
	}
</script>