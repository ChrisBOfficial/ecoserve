<template>
  <div>
    <Header/>
    <section class="py-5">
      <header class="masthead">
        <div class="container h-100">
          <div class="row h-100 align-items-center">
            <div class="col-12 text-center">
              <h1 class="font-weight-light" style="color:white;">ENVIRONMENTAL CONSERVATION PROJECT</h1>
            </div>
          </div>
        </div>
      </header>

      <div class="container h-100">
        <div class="row h-100 align-items-center">
          <div class="col-12 text-center">
            <h2 class="font-weight-light">ABOUT US</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
              Repellendus ab nulla dolorum autem nisi officiis blanditiis voluptatem hic, 
              assumenda aspernatur facere ipsam nemo ratione cumque magnam enim fugiat reprehenderit expedita.</p>
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

export default {
  name: 'about',
  components: {
    Header,
    Footer
  }
}
</script>
