export default {
	required: v => !!v || 'To pole jest wymagane!',
	email: v => {
		const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return pattern.test(v) || 'Niepoprawny e-mail.'
	},
	passwordLength: v => v.length >= 8 || 'Hasło musi mieć co najmniej 8 liter!'
}