<template>
    <div>
        <Header />
        <section style="padding: 3vh 0vh;">
            <section class="features-icons bg-light text-center">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-4">
                            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div class="features-icons-icon d-flex">
                                    <i class="icon-shield m-auto"></i>
                                </div>
                                <h3>Safe Data</h3>
                                <p class="lead mb-0">Account data and survey data is encrypted.</p>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div class="features-icons-icon d-flex">
                                    <i class="icon-lock m-auto"></i>
                                </div>
                                <h3>Secure Communication</h3>
                                <p class="lead mb-0">All website communication is encrypted over HTTPS.</p>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="features-icons-item mx-auto mb-0 mb-lg-3">
                                <div class="features-icons-icon d-flex">
                                    <i class="icon-check m-auto"></i>
                                </div>
                                <h3>Standardized</h3>
                                <p class="lead mb-0">
                                    Account authorization is through OAuth 2.0, an industry standard.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Image Showcases -->
            <section class="showcase">
                <div class="container-fluid p-0">
                    <div class="row no-gutters">
                        <div
                            class="col-lg-6 order-lg-2 text-white showcase-img"
                            style="background-image: url('etc/bluelock.jpg');"
                        ></div>
                        <div class="col-lg-6 order-lg-1 my-auto showcase-text">
                            <h2>Safe Data</h2>
                            <p class="lead mb-0">
                                All of your account information and survey response data is encrypted in-transit and
                                at-rest. This means your data is safe being sent to and from our website, as well as
                                when it is stored in our database.
                            </p>
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div
                            class="col-lg-6 text-white showcase-img"
                            style="background-image: url('etc/java.jpg');"
                        ></div>
                        <div class="col-lg-6 my-auto showcase-text">
                            <h2>Secure Communication</h2>
                            <p class="lead mb-0">
                                All communication with ecoserve is encrypted with HTTPS, preventing malicious actors
                                from snooping on your data and hijacking your browser.
                            </p>
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div
                            class="col-lg-6 order-lg-2 text-white showcase-img"
                            style="background-image: url('etc/oauth2.jpg');"
                        ></div>
                        <div class="col-lg-6 order-lg-1 my-auto showcase-text">
                            <h2>Standardized</h2>
                            <p class="lead mb-0">
                                We authorize your account with OAuth 2.0, the industry-standard protocol for
                                authorization. This ensures that it is you and only you accessing your projects.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </section>
        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
    name: "security",
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
@import "https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css";

h1,
h2,
h3,
h4,
h5,
h6 {
    font-weight: 700;
}
</style>
