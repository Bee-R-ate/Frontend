<template>
  <v-app >
    <Header />
    <router-view class="pa-10"></router-view>
    <Footer />
    <Snackbar />
  </v-app>
</template>

<script>
  import Header from './components/layout/Header'
  import Footer from './components/layout/Footer'
  import Snackbar from './components/snackbar/Snackbar'
  import {fb} from '@/firebase/firebase'

  export default {
    name: 'App',

    components: {
      Header, Footer, Snackbar
    },

    created() {
      fb.auth().onAuthStateChanged(user => user ? this.$store.commit("user", user) : this.$store.commit("signOut"));
    }
  };
</script>
