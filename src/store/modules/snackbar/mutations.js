export default {
	snackbar: (state, snackbarText) =>{
		state.snackbarText = snackbarText;
		state.snackbar = true;
	},
	unsetSnackbar: state => {
		state.snackbarText = '';
		state.snackbar = false;
	}
}