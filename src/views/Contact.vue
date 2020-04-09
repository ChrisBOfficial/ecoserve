<template>
    <div>
        <Header />
        <section style="min-height:100vh;">
            <div class="container h-100" style="padding: 25vh 0vh 0vh 0vh;">
                <div class="row h-100">
                    <div class="col text-center align-items-center">
                        <img src="@/assets/dirac.jpg" alt="Team profile" class="contact-profile" />
                        <p>Dirac Twidwell</p>
                    </div>
                    <div class="col text-center align-items-center">
                        <img src="@/assets/dillon.jpg" alt="Team profile" class="contact-profile" />
                        <p>Dillon Fogarty</p>
                    </div>
                    <div class="col text-center align-items-center">
                        <img src="@/assets/nebraska-n.jpg" alt="Team profile" class="contact-profile" />
                        <p>General inquiries</p>
                    </div>
                </div>
            </div>

            <div class="container h-100">
                <div class="row h-100">
                    <div class="col text-center">
                        <p>
                            308 Kelm Hall<br />
                            Lincoln, NE 68593<br />
                            <a href="mailto:dirac.twidwell@unl.edu">dirac.twidwell@unl.edu</a>
                        </p>
                    </div>

                    <div class="col text-center">
                        <p>
                            104 Kelm Hall<br />
                            Lincoln, NE 68593<br />
                            <a href="mailto:dillon.fogarty@huskers.unl.edu">dillon.fogarty@huskers.unl.edu</a>
                        </p>
                    </div>

                    <div class="col text-center">
                        <p>
                            <a href="mailto:rangelandscience@unl.edu">rangelandscience@unl.edu</a>
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
    },
    created() {
        window.scrollTo(0, 0);
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
</style>
