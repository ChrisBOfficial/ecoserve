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
  components: {
    Header,
    Footer
  }
}
</script>

<!--CSS Styling-->
<style scoped>
@import "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css";
@import "./assets/style.css";
</style>
