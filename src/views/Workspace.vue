<template>
  <div>
    <Header/>

    <Footer/>
  </div>
</template>


<script>

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
var request = require('request');

export default {
  name: 'workspace',
  components: {
    Header,
    Footer
  }
}

</script>