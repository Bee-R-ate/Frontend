import firebase from 'firebase'
import 'firebase/app'
import 'firebase/firestore'

var firebaseConfig = {
	apiKey: "AIzaSyCEiUV7KuhGb6ux9RdjUUF2u5CRtUeC3YQ",
	authDomain: "bilard-centrum-lubin.firebaseapp.com",
	databaseURL: "https://bilard-centrum-lubin.firebaseio.com",
	projectId: "bilard-centrum-lubin",
	storageBucket: "bilard-centrum-lubin.appspot.com",
	messagingSenderId: "537689316828",
	appId: "1:537689316828:web:960af9211d597202024319"
};

export const fb = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();