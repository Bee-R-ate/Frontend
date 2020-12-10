<template>
	<v-form ref="form" >
		<h2>Logowanie</h2>
		<v-text-field :rules="[rules.required, rules.email]" type="email" v-model="email" label="Adres E-mail *"></v-text-field>
		<v-text-field :rules="[rules.required, rules.passwordLength]" type="password" v-model="password" label="Hasło *"></v-text-field>

		<v-checkbox v-model="remember" label="Zapamiętaj mnie"></v-checkbox>
		<v-btn class="btn--black" @click="login">Wyślij</v-btn>
	</v-form>
</template>
<script>
	import rules from '@/helpers/validation/rules'
	import {fb} from '@/firebase/firebase'

	export default {
		data() {
			return {
				email: '',
				password: '',
				rules,
				remember: false
			}
		},
		methods: {
			login() {
				if(!this.$refs.form.validate()) return;

				fb.auth().signInWithEmailAndPassword(this.email, this.password)
				.then(user => {
					this.$store.commit('user', user.user);
					sessionStorage.setItem('user', JSON.stringify(user.user))
					if(this.remember) localStorage.setItem('user', JSON.stringify(user.user))
					this.$store.commit('snackbar', 'Pomyślnie zalogowano!');
				})
				.catch(error => {
					console.log(error)
					if(error.code == "auth/wrong-password") this.$store.commit('snackbar', 'Nieprawidłowe hasło!');
					if(error.code == 'auth/user-not-found') this.$store.commit('snackbar', 'Taki użytkownik nie istnieje! Zarejestruj się!');
				});
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