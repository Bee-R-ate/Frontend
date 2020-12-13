<template>
	<div class="d-flex justify-center home-container">
		<div class="home-content position-relative friends">
			<div class="back-container">
				<v-btn link to="/" icon>
					<v-icon>mdi-arrow-left-circle</v-icon>
				</v-btn>
			</div>
			<h2 class="home-title mb-3 mt-2">{{ room.name }}</h2>

			<v-list v-if="room.modID == user.docID" class="py-0 friend-list">
				<div v-for="(participant, i) in room.participants" :key="i">
					<v-list-item class="px-0">
						<v-list-item-avatar :size="60" class="ml-3">
							<v-img :src="getParticipant(participant.userID).imageURL"></v-img>
						</v-list-item-avatar>

						<v-list-item-content class="position-relative ">
							<div class="pr-3 py-3">
								<v-list-item-title v-html="getParticipant(participant.userID).name"></v-list-item-title>
							</div>
						</v-list-item-content>
					</v-list-item>
					<v-divider v-if="i != room.participants.length - 1"></v-divider>
				</div>
			</v-list>
			

		</div>
	</div>
</template>

<script>
	import {db} from '@/firebase/firebase'
	
	export default {
		methods: {
			async getParticipant(id) {
				let promise = await db.collection('users').doc(id).get();
				let participant = promise.data();
				console.log(participant)
				return participant;
			}
		},
		computed: {
			room() {
				return this.$store.getters.room;
			},
			user() {
				return this.$store.getters.user;
			}
		},
		created() {
			this.$store.dispatch('room', this.$route.params.id);
		}
	}
</script>