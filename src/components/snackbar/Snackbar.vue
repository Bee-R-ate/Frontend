<template>
	<div class="text-center">
		<v-snackbar color="secondary" v-model="snackbar" class="mt-3" top > 
			<span class="black--text">{{ text }}</span>

			<template v-slot:action="{ attrs }">
				<v-btn color="black" text v-bind="attrs" @click="snackbar = false" >
					Zamknij
				</v-btn>
			</template>
		</v-snackbar>
	</div>
</template>

<script>
	export default{
		watch:{
			snackbar(){
				setTimeout(()=>{this.$store.commit('unsetSnackbar'); }, 3000);
			}
		},
		computed:{
			snackbar(){
				return this.$store.getters.snackbar;
			},
			text(){
				return this.$store.getters.snackbarText;
			}
		}
	}
</script>