<template>
	<div class="d-flex justify-center home home-container">
		<div class="home-content position-relative">
			<div class="back-container">
				<v-btn link to="/moje-pokoje" icon>
					<v-icon>mdi-arrow-left-circle</v-icon>
				</v-btn>
			</div>
			<div v-for="(beer, i) in room.beerList" :key="i">
				<div v-if="room.currentBeer == i">
					<img class="beer-photo" width="auto" height="280px" :src="beersData[i] ? beersData[i].photoUrl : ''" alt="logo bee-r-ate">
					<h2 class="home-title mb-8">{{ beersData[i] ? beersData[i].name : '' }}</h2>

					<v-slider class="mt-12" step="1" max="5"  v-model="appearance" label="Wygląd" track-color="white" color="black"  thumb-label="always" ></v-slider>
					<v-slider class="mt-10" step="1" max="10"  v-model="taste" label="Smak" color="black" track-color="white" thumb-label="always" ></v-slider>
					<v-slider class="mt-10" step="1" max="10"  v-model="smell" label="Zapach" color="black" track-color="white" thumb-label="always" ></v-slider>
					<v-slider class="mt-10" step="1" max="5"  v-model="sensations" label="Odczucia w ustach" color="black" track-color="white" thumb-label="always" ></v-slider>
					<v-slider class="mt-10" step="1" max="20"  v-model="subjective" label="Subiektywna ocena" color="black" track-color="white" thumb-label="always" ></v-slider>


					<v-btn x-large block class="mt-8" @click="ready" :disabled="currentParticipant.isReady" color="success">Gotowy</v-btn>
				</div>
			</div>
			
			
		</div>
	</div>
</template>

<script>
	import {db} from '@/firebase/firebase'

	export default {
		data() {
			return {
				beersData: [],
				participantsData: [],
				taste: 0,
				appearance: 0,
				subjective: 0,
				smell: 0,
				sensations: 0
			}

		},
		watch: {
			room: {
				deep: true,
				handler() {
					if(this.room.beerList) this.setBeersData();
					if(this.room.participants) {
						this.setParticipantsData();
						if(this.room.participants.some(participant => participant.isReady)) this.nextBeer();
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
			currentParticipant() {
				return this.room.participants.find(participant => participant.userID == this.user.docID);
			}
		},
		methods: {
			nextBeer() {
				console.log(this.room.participants.some(participant => participant.isReady));
			},
			setBeersData() {
				this.room.beerList.forEach(async beer => {

					let promise = await db.collection('beers').doc(beer.beerID).get();
					let data = {...promise.data(), id: promise.id}
					if(this.beersData.find(beerData => beerData.id == data.id) == undefined) {
						this.beersData.push(data);
					}
				})
			},
			setParticipantsData() {
				this.room.participants.forEach(async participant => {

					let promise = await db.collection('users').doc(participant.userID).get();
					let data = {...promise.data(), id: promise.id}
					if(this.participantsData.find(userData => userData.id == data.id) == undefined) {
						this.participantsData.push(data);
					}
				})
			}, 
			ready() {
				this.$store.commit('loading', true);
				let participants = this.room.participants;
				participants[participants.indexOf(participants.find(participant => participant.userID == this.user.docID))].isReady = true;

				let beerList = this.room.beerList;
				let userScores = beerList[this.room.currentBeer].userScores;
				let userScoreIndex = userScores.indexOf(userScores.find(user => user.userID == this.user.docID))
				userScores[userScoreIndex].appearanceScore = this.appearance;
				userScores[userScoreIndex].sensationsScore = this.sensations;
				userScores[userScoreIndex].smellScore = this.smell;
				userScores[userScoreIndex].tasteScore = this.taste;
				userScores[userScoreIndex].subjectiveScore = this.subjective;
				userScores[userScoreIndex].avgScore = (this.subjective + this.appearance + this.sensations + this.smell + this.taste) / 5;

				db.collection('rooms').doc(this.room.id).update({participants, beerList}).then(() => {
					this.$store.commit('snackbar', 'Zgłosiłeś gotowość!');
					this.$store.commit('loading', false);
				}).catch(() => {
					this.$store.commit('snackbar', 'Błąd serwera, przepraszamy...');
					this.$store.commit('loading', false);
				})
			}
		},
		created() {
			this.$store.dispatch('room', this.$route.params.id);
		}
	}
</script>

<style>
	.beer-photo {
		border-radius: 50%;
	}

</style>