<template>
	<div class="d-flex justify-center home-container profile">
		<div class="home-content justify-center align-center text-center position-relative">
			<div class="back-container">
				<v-btn link to="/" icon>
					<v-icon>mdi-arrow-left-circle</v-icon>
				</v-btn>
			</div>
			<img class="profile-photo" :src="activePhoto" alt="avatar">
			
			<h2 class="home-title mb-3">Edytuj profil</h2>
			<v-form ref="form">
				<v-row>
					<v-col sm="6" cols="12" class="pa-0 pa-sm-1">
						<v-file-input show-size accept="image/png, image/jpeg, image/bmp, image/gif, image/svg, image/jfif" :rules="[rules.fileSize]" color="black" class="mt-0" v-model="file" label="Zdjęcie"></v-file-input>
					</v-col>
					<v-col sm="6" cols="12" class="pa-0 pa-sm-1">
						<v-text-field color="black" class="mt-0" v-model="user.name" label="Imię i nazwisko"></v-text-field>
					</v-col>
					<v-col sm="6" cols="12" class="pa-0 pa-sm-1">
						<v-text-field color="black" class="mt-0" v-model="user.email" disabled label="Adres E-mail"></v-text-field>
					</v-col> 
					<v-col sm="6" cols="12" class="pa-0 pa-sm-1">
						<v-text-field color="black" type="password" :rules="[passwordOperation]" class="mt-0" v-model="oldPassword" label="Stare hasło"></v-text-field>
					</v-col>
					<v-col sm="6" cols="12" class="pa-0 pa-sm-1">
						<v-text-field color="black" type="password" :rules="[newPasswordOperation]" class="mt-0" v-model="newPassword" label="Nowe hasło"></v-text-field>
					</v-col>
					<v-col sm="6" cols="12" class="pa-0 pa-sm-1">
						<v-text-field color="black" type="password" :rules="[checkConfirmPassword]" class="mt-0" v-model="confirmPassword" label="Powtórz Nowe hasło"></v-text-field>
					</v-col>

				</v-row>

				<v-btn @click="editProfile" class="mb-3" color="secondary">Edytuj</v-btn>


			</v-form>
			
		</div>
	</div>
</template>

<script type="text/javascript">
	import rules from '@/helpers/validation/rules'

	export default {
		data() {
			return {
				oldPassword: '',
				newPassword: '',
				confirmPassword: '',
				file: null,
				rules
			}
		},
		computed: {
			user() {
				return this.$store.getters.user;
			},
			activePhoto() {
				return this.file == null ? this.user.imageURL : URL.createObjectURL(this.file);
			}
		},
		methods: {
			editProfile() {
				if(!this.$refs.form.validate()) return;

				this.$store.dispatch('editUser', {
					oldPassword: this.oldPassword,
					newPassword: this.newPassword,
					file: this.file,
					email: this.user.email,
					name: this.user.name
				})
			},
			passwordOperation(v) {
				return this.newPassword ? (!!v || 'Proszę podać stare hasło!') : true;
			},
			checkConfirmPassword(v) {
				return v == this.newPassword || 'Hasła muszą być identyczne!';
			},
			newPasswordOperation(v) {
				return this.oldPassword ? (!!v || 'Proszę podać nowe hasło!') : true;
			},
			
		}
	}
</script>


<style>
	.profile .back-container {
		top: 0;
	}
	.home-container.profile {
		/*overflow-y: scroll;*/
	}
	.profile-photo {
		max-width: 150px;
		height: 150px;
		border-radius: 50%;
		object-fit: cover;
		margin: auto;
	}
</style>