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
					<router-link :to="`/pokoj/${room.id}`">
						<v-list-item class="px-0">

							<v-list-item-content class="pa-5">
								<div class="">
									<v-list-item-title v-html="room.name"></v-list-item-title>
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
	export default {
		computed: {
			rooms() {
				return this.$store.getters.myRooms;
			}
		},
		
	}
</script>

<style>
	.room-listing .back-container{
		top: -20%;
	}
</style>