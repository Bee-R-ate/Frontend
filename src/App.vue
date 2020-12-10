<template>
  <v-app >
    <Header />
    <router-view class="pa-10"></router-view>
    <Footer />
  </v-app>
</template>

<script>
  import Header from './components/layout/Header';
  import Footer from './components/layout/Footer';

  export default {
    name: 'App',

    components: {
      Header, Footer
    },

    data: () => ({

    }),
  };
</script>
