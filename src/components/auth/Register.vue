<template>
	<v-form ref="form" >
		<h2>Rejestracja</h2>
		<v-text-field :rules="[rules.required]" v-model="userData.name" label="Imię i nazwisko *"></v-text-field>
		<v-text-field :rules="[rules.required, rules.email]" type="email" v-model="userData.email" label="Adres E-mail *"></v-text-field>
		<v-text-field :rules="[rules.required, rules.passwordLength]" type="password" v-model="userData.password" label="Hasło *"></v-text-field>
		<v-text-field :rules="[rules.required, confirmPassword]" type="password" v-model="userData.confirmPassword" label="Potwierdź Hasło *"></v-text-field>

		<v-checkbox label="Zapamiętaj mnie"></v-checkbox>
		<v-checkbox :rules="[rules.required]" v-model="rodo1" label="Rodo1"></v-checkbox>
		<v-checkbox :rules="[rules.required]" v-model="rodo2" label="Rodo2"></v-checkbox>
		<v-btn class="btn--black" @click="register">Wyślij</v-btn>
	</v-form>
</template>
<script>
	import rules from '@/helpers/validation/rules'

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
				rules
			}
		},
		firestore: {

		},
		methods: {
			confirmPassword(v) {
				return v == this.userData.password || 'Hasła muszą być identyczne!';
			},
			register() {
				if(!this.$refs.form.validate()) return;
			},
		}
	}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
	btn {
		color: red;
		&--black {
			color: green !important;
		}
	}
</style>