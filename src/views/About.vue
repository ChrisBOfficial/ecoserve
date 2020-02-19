<template>
    <div>
        <Header />
        <section class="py-5" style="min-height:100vh;">
            <div class="container h-100" style="padding: 15vh 0vh 0vh 0vh;">
                <div class="row h-100 align-items-center">
                    <div class="col-12 text-center">
                        <h2 class="font-weight-light">ABOUT US</h2>
                        <p>
                            A platform for the integration of traditional and local knowledge with ecosystem service
                            assessments and environmental decision making.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
    name: "about",
    components: {
        Header,
        Footer
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
@import "https://fonts.googleapis.com/css?family=Varela+Round";
@import "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i";
</style>
