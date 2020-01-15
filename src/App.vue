<template>
  <div id="app">
    <!-- Dynamically loaded views -->
    <router-view/>
  </div>
</template>

<script>
import store from './store'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  store,
  components: {
    Header,
    Footer
  },
  created: function() {
    if (process.env.NODE_ENV == "development") {
      this.$store.state.apiUrl = "http://localhost:3000";
    } else if (process.env.NODE_ENV == "production") {
      this.$store.state.apiUrl = window.location.origin;
    }
  }
}
</script>

<!--CSS Styling-->
<style scoped>
@import "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css";
@import "./assets/style.css";
</style>
