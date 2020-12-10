<template>
  <v-app >
    <Header />
    <router-view class="pa-10"></router-view>
    <Footer />
    <Snackbar />
  </v-app>
</template>

<script>
  import Header from './components/layout/Header';
  import Footer from './components/layout/Footer';
  import Snackbar from './components/snackbar/Snackbar';

  export default {
    name: 'App',

    components: {
      Header, Footer, Snackbar
    },

    methods: {
      autoLogin() {
        if(localStorage.getItem('user')) {
          this.$store.commit('user', JSON.parse(localStorage.getItem('user')))
        }

        if(sessionStorage.getItem('user')) {
          this.$store.commit('user', JSON.parse(sessionStorage.getItem('user')))
        }
      }
    },
    created() {
      this.autoLogin();
    }
  };
</script>
