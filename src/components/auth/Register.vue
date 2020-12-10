<template>
	<div>
		<form>
			<input type="text" v-model="name" label="Imię i nazwisko *">
			<input type="email" v-model="email" label="Adres E-mail *">
			<input type="password" v-model="password" label="Hasło *">
			<input type="password" v-model="confirmPassword" label="Potwierdź Hasło *">

			<input type="checkbox" label="Zapamiętaj mnie">

			<input type="checkbox" v-model="rodo1" label="Rodo1">
			<input type="checkbox" v-model="rodo2" label="Rodo2">

			<button @click.prevent="register"></button>
		</form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				userData: {
					name: '',
					email: '',
					password: '',
					confirmPassword: ''
				},
				rodo1: false,
				rodo2: false,
				
			}
		}
	}
</script>