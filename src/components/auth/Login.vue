<template>
	<div class="d-flex justify-center text-center auth home-container">
		<v-form ref="form" class="login-form">
			<div class="back-container">
				<v-btn link to="/" icon>
					<v-icon>mdi-arrow-left-circle</v-icon>
				</v-btn>
			</div>
			<h2 class="login-title">Logowanie</h2>
			<v-text-field color="black" :rules="[rules.required, rules.email]" type="email" v-model="email" label="Adres E-mail *"></v-text-field>
			<v-text-field color="black" :rules="[rules.required, rules.passwordLength]" type="password" v-model="password" label="Hasło *"></v-text-field>

			<v-btn class="btn--black mt-5" @click="login">Zaloguj się</v-btn>

			<p class="mb-1 mt-5" style="font-size: .9rem">Nie masz konta?</p>
			<v-btn link to="/rejestracja" class="mb-5" color="secondary">Zarejestruj się</v-btn>
		</v-form>
	</div>
</template>
<script>
	import rules from '@/helpers/validation/rules'
	import {fb, db} from '@/firebase/firebase'

	export default {
		data() {
			return {
				email: '',
				password: '',
				rules,
			}
		},
		methods: {
			login() {
				if(!this.$refs.form.validate()) return;
				this.$store.commit('loading', true);
				fb.auth().signInWithEmailAndPassword(this.email, this.password)
				.then(user => {
					this.$store.commit('snackbar', 'Pomyślnie zalogowano!');
					this.$store.commit('loading', false);
					this.$router.push('/');
					db.collection('users').where('Email', '==', user.user.email).limit(1).get().then(querySnapshot => {
						querySnapshot.forEach(doc => {
							this.$store.commit('user', {...user.user, docID: doc.id, ...doc.data()})
						})
					})
				})
				.catch(error => {
					this.$store.commit('loading', false);
					if(error.code == "auth/wrong-password") this.$store.commit('snackbar', 'Nieprawidłowe hasło!');
					if(error.code == 'auth/user-not-found') this.$store.commit('snackbar', 'Taki użytkownik nie istnieje! Zarejestruj się!');
				});
			},
		}
	}
</script>
<style lang="scss" rel="stylesheet/scss">
	btn {
		color: red;
		&--black {
			color: green !important;
		}
	}
	.login-form {
		min-width: 75%;
		position: relative;
	}
	.login-title {
		font-size: 2.5rem;

	}
	
</style>