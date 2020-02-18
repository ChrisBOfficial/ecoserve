<template>
    <div>
        <Header />
        <header class="masthead">
            <div class="container d-flex h-100 align-items-center">
                <div class="mx-auto text-center">
                    <h1 class="font-weight-light" style="color:white;">
                        INTERGRATIVE ECOSYSTEM SERVICE ANALYSIS TOOL
                    </h1>
                </div>
            </div>
        </header>
        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
    name: "home",
    components: {
        Header,
        Footer
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
@import "../assets/fonts/css/all.css";
@import "https://fonts.googleapis.com/css?family=Varela+Round";
@import "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i";
</style>
