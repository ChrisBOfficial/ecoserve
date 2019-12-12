<template>
  <div>
    <Header/>
    <section class="py-5">
      <header class="masthead">
          <b-row class="h-100 align-items-center">
            <div class="col-12 text-center">
              <h1 class="font-weight-light" style="color:white;">INTERGRATIVE ECOSYSTEM SERVICE ANALYSIS TOOL</h1>
            </div>
          </b-row>
      </header>

      <div class="container h-100">
        <div class="row h-100 align-items-center">
          <div class="col-12 text-center">
            <h2 class="font-weight-light">ABOUT US</h2>
            <p>A platform for the integration of traditional and local knowledge 
              with ecosystem service assessments and environmental decision making.</p>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
var request = require('request');

export default {
  name: 'about',
  components: {
    Header,
    Footer
  }
}
</script>
