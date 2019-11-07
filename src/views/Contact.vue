<template>
    <div>
        <Header/>
        <section>
            <div class="container h-100">
                <div class="row h-100">
                    <div class="col text-center align-items-center">
                        <img src="@/assets/profile.png" alt="Team profile" class="contact-profile">
                        <p>Name</p>
                    </div>
                    <div class="col text-center align-items-center">
                        <img src="@/assets/profile.png" alt="Team profile" class="contact-profile">
                        <p>Name</p>
                    </div>
                    <div class="col text-center align-items-center">
                        <img src="@/assets/profile.png" alt="Team profile" class="contact-profile">
                        <p>Name</p>
                    </div>
                </div>        
            </div>

            <div class="container h-100">
                <div class="row h-100">
                    <div class="col text-center">
                        <p>
                            Contact us:<br>
                            xxx Street Name,<br>
                            Lincoln NE xxxxxx<br>
                            xxx@unl.edu<br>
                            xxx-xxx-xxx<br>
                        </p>
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
  name: 'contact',
  components: {
    Header,
    Footer
  }
}
</script>
