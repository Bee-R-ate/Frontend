<template>
	<div class="d-flex align-center justify-center text-center ">
		<v-form ref="form" class="login-form">
			<div class="back-container">
				<v-btn link to="/" icon>
					<v-icon>mdi-arrow-left-circle</v-icon>
				</v-btn>
			</div>
			<h2 class="login-title">Rejestracja</h2>
			<v-text-field color="black" :rules="[rules.required]" v-model="name" label="Imię i nazwisko *"></v-text-field>
			<v-text-field color="black" :rules="[rules.required, rules.email]" type="email" v-model="email" label="Adres E-mail *"></v-text-field>
			<v-text-field color="black" :rules="[rules.required, rules.passwordLength]" type="password" v-model="password" label="Hasło *"></v-text-field>
			<v-text-field color="black" :rules="[rules.required, confirmPasswordRule]" type="password" v-model="confirmPassword" label="Potwierdź Hasło *"></v-text-field>

			<v-checkbox color="black" :rules="[rules.required]" v-model="rodo1" label="Rodo1"></v-checkbox>
			<v-checkbox color="black" :rules="[rules.required]" v-model="rodo2" label="Rodo2"></v-checkbox>
			<v-btn class="btn--black" @click="register">Wyślij</v-btn>

			<p class="mb-1 mt-5" style="font-size: .9rem">Masz już konto?</p>
			<v-btn link to="/logowanie" color="secondary">Zaloguj się!</v-btn>
		</v-form>
	</div>
</template>
<script>
	import rules from '@/helpers/validation/rules'
	import {fb, db} from '@/firebase/firebase'

	export default {
		data() {
			return {
				name: '',
				email: '',
				password: '',
				confirmPassword: '',
				rodo1: false,
				rodo2: false,
				rules
			}
		},
		methods: {
			confirmPasswordRule(v) {
				return v == this.password || 'Hasła muszą być identyczne!';
			},
			register() {
				if(!this.$refs.form.validate()) return;

				fb.auth().createUserWithEmailAndPassword(this.email, this.password)
				.then((result) => {
					this.$store.commit('user', result.user);
					this.$store.commit('snackbar', 'Pomyślnie zarejestrowano!');
					this.$router.push('/');
					db.collection('users').add({
						Email: this.email,
						Name: this.name,
						ImageURL: 'https://avatars0.githubusercontent.com/u/9064066?v=4&s=460',
						ID: result.user.uid,
						Friends: [],
						BeerList: []
					}).then(doc => {
						this.$store.commit('user', {...this.$store.getters.user, docID: doc.id, ...doc.data()})
					})
					return result.user.updateProfile({
						displayName: this.name
					})
				})
				.catch((error) => {
					console.log(error)
					if(error.code == "auth/email-already-in-use") this.$store.commit('snackbar', 'Taki email już istnieje!');
					if(error.code == 'auth/internal-error') this.$store.commit('snackbar', 'Błąd serwera, przepraszamy...');
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

	.back-container {
		position: absolute;
		top: -6%;
		left: 0;

	}
</style>