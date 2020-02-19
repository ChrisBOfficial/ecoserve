<template>
    <div>
        <Header />
        <section style="min-height:100vh;">
            <div class="container h-100" style="padding: 15vh 0vh 0vh 0vh;">
                <div class="row h-100">
                    <div class="col text-center align-items-center">
                        <img src="@/assets/profile.png" alt="Team profile" class="contact-profile" />
                        <p>Name</p>
                    </div>
                    <div class="col text-center align-items-center">
                        <img src="@/assets/profile.png" alt="Team profile" class="contact-profile" />
                        <p>Name</p>
                    </div>
                    <div class="col text-center align-items-center">
                        <img src="@/assets/profile.png" alt="Team profile" class="contact-profile" />
                        <p>Name</p>
                    </div>
                </div>
            </div>

            <div class="container h-100">
                <div class="row h-100">
                    <div class="col text-center">
                        <p>
                            Contact us:<br />
                            xxx Street Name,<br />
                            Lincoln NE xxxxxx<br />
                            xxx@unl.edu<br />
                            xxx-xxx-xxx<br />
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
    name: "contact",
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
