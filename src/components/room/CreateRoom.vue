<template>
	<div class="d-flex align-center justify-center text-center create-room home-container">
		<div class="home-content position-relative">
			<div class="back-container">
				<v-btn link to="/" icon>
					<v-icon>mdi-arrow-left-circle</v-icon>
				</v-btn>
			</div>
			<h2 class="home-title">Dodaj listę piw!</h2>
			<p class="home-subtitle">Kliknij w piwo, aby dodać je do listy!</p>
			<v-text-field color="black" label="Znajdź piwo..." prepend-icon="mdi-magnify" v-model="search"></v-text-field>
			<v-list v-if="beers.length > 0" class="py-0 friend-list">
				<div v-for="(beer, i) in beers" :key="i">
					<div @click="addToBeerList(beer)" v-if="beer.Name.toLowerCase().includes(search.toLowerCase()) && beerList.indexOf(beer) == -1">
						<v-list-item class="px-0">
							<v-list-item-avatar :size="60" class="ml-3">
								<v-img :src="beer.ImageURL"></v-img>
							</v-list-item-avatar>

							<v-list-item-content class="position-relative ">
								<div class="pr-3 py-3">
									<v-list-item-title v-html="beer.Name"></v-list-item-title>
								</div>
							</v-list-item-content>
						</v-list-item>
						<v-divider v-if="i != beers.length - 1"></v-divider>
					</div>
				</div>
			</v-list>
			<div v-else>
				Nie masz w tej chwili piw, <router-link to="/piwa">zneutralizuj suszę i dodaj piwa</router-link>.
			</div>

			<div v-if="beerList.length > 0">
				<h2 class="home-title">Wybrane piwa:</h2>
				<v-list class="py-0 mt-3 friend-list">
					<div v-for="(beer, i) in beerList" :key="i">
						<v-list-item class="px-0">
							<v-list-item-avatar :size="60" class="ml-3">
								<v-img :src="beer.ImageURL"></v-img>
							</v-list-item-avatar>

							<v-list-item-content class="position-relative ">
								<div class="pr-3 py-3">
									<v-list-item-title v-html="beer.Name"></v-list-item-title>
								</div>
								<div class="delete-friend-container">
									<div>
										<v-btn small-x class="" @click="deleteFromBeerList(beer)" icon>
											<v-icon>mdi-close</v-icon>
										</v-btn>
									</div>
								</div>
							</v-list-item-content>
						</v-list-item>
						<v-divider v-if="i != beers.length - 1"></v-divider>
					</div>
				</v-list>
			</div>

			<h2 v-if="invitedFriends.length != friends.length" class="home-title">Zaproś graczy!</h2>
			<v-list v-if="friends.length > 0" class="py-0 mt-3 friend-list">
				<div v-for="(friend, i) in friends" :key="i">
					<div @click="inviteFriend(friend)" v-if="invitedFriends.indexOf(friend) == -1">
						<v-list-item class="px-0">
							<v-list-item-avatar :size="60" class="ml-3">
								<v-img :src="friend.ImageURL"></v-img>
							</v-list-item-avatar>

							<v-list-item-content class="position-relative ">
								<div class="pr-3 py-3">
									<v-list-item-title v-html="friend.Name"></v-list-item-title>
								</div>
							</v-list-item-content>
						</v-list-item>
						<v-divider v-if="i != friends.length - 1"></v-divider>
					</div>
				</div>
			</v-list>
			<div v-else>
				Nie masz w tej chwili znajomych. <router-link to="/znajomi">Kliknij, aby się uspołecznić</router-link>.
			</div>

			<div v-if="invitedFriends.length > 0">
				<h2 class="home-title">Lista zaproszonych graczy</h2>
				<v-list class="py-0 mt-3 friend-list">
					<div v-for="(friend, i) in invitedFriends" :key="i">
						<v-list-item class="px-0">
							<v-list-item-avatar :size="60" class="ml-3">
								<v-img :src="friend.ImageURL"></v-img>
							</v-list-item-avatar>

							<v-list-item-content class="position-relative ">
								<div class="pr-3 py-3">
									<v-list-item-title v-html="friend.Name"></v-list-item-title>
								</div>
								<div class="delete-friend-container">
									<div>
										<v-btn small-x class="" @click="deleteFromInvitedFriends(friend)" icon>
											<v-icon>mdi-close</v-icon>
										</v-btn>
									</div>
								</div>
							</v-list-item-content>
						</v-list-item>
						<v-divider v-if="i != invitedFriends.length - 1"></v-divider>
					</div>
				</v-list>
			</div>

			<v-btn class="mt-12" :disabled="beerList.length == 0 || invitedFriends.length == 0" color="secondary" @click="createRoom">Utwórz pokój</v-btn>
		</div>
	</div>
</template>

<script>
	// import {db} from '@/firebase/firebase'

	export default {
		data() {
			return {
				beerList: [],
				search: '',
				invitedFriends: [],
			}
		},
		computed: {
			beers() {
				return this.$store.getters.beers;
			},
			friends() {
				return this.$store.getters.friends;
			},
			user() {
				return this.$store.getters.user;
			}
		},
		methods: {
			deleteFromBeerList(beer) {
				this.beerList.splice(this.beerList.indexOf(beer), 1);
			},
			deleteFromInvitedFriends(friend) {
				this.invitedFriends.splice(this.invitedFriends.indexOf(friend), 1);
			},
			addToBeerList(beer) {
				this.beerList.push(beer);
			},
			inviteFriend(friend) {
				this.invitedFriends.push(friend);
			},
			createRoom() {
				let beerList = [];
				this.beerList.forEach(beer => {
					beerList.push({
						beerData: beer,
						userScores: ''
					})
				})
				// db.collection('rooms').add({
				// 	ModID: this.user.docID,
				// 	BeerList: this.beerList,

				// })
				
			}
		}
	}
</script>

<style>
	.create-room {
		overflow-y: scroll;
	}

	.create-room .home-title {
		margin-top: 2rem!important;
	}
</style>
