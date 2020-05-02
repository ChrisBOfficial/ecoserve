<template>
    <div>
        <Header />
        <header class="masthead">
            <div class="container d-flex h-100 align-items-center">
                <div class="mx-auto text-center">
                    <h1 class="font-weight-light" style="color:white;">
                        INTEGRATIVE ECOSYSTEM SERVICE ANALYSIS TOOL
                    </h1>
                </div>
            </div>
        </header>

        <header class="masthead about first">
            <div class="container h-100">
                <div class="row h-100">
                    <div class="col-lg-12 my-auto">
                        <div class="header-content mx-auto">
                            <h3 class="mb-5">
                                A tool for integrating stakeholder knowledge with ecosystem service assessments
                            </h3>
                            <a :href="loginLink" class="btn btn-outline btn-xl">Start Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <header class="masthead about second">
            <div class="container h-100">
                <div class="row h-100">
                    <div class="col-lg-5 my-auto">
                        <div class="header-content mx-auto">
                            <h3 class="mb-5">
                                IESAT lets you create ecosystem service assessments in real-time using stakeholder
                                knowledge
                            </h3>
                        </div>
                    </div>
                    <div class="col-lg-7 my-auto">
                        <div class="device-container">
                            <div class="device-mockup hero">
                                <div class="device" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <section class="features" id="features">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12 my-auto">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-lg-3">
                                    <div class="feature-item">
                                        <i class="las la-puzzle-piece text-primary"></i>
                                        <h3>Integration</h3>
                                        <p class="text-muted">
                                            Compare and integrate stakeholder knowledge with biophysical assessments
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="feature-item">
                                        <i class="las la-globe text-primary"></i>
                                        <h3>Place based assessments</h3>
                                        <p class="text-muted">
                                            Compare ecosystem service provisioning among regions
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="feature-item">
                                        <i class="las la-exclamation-triangle text-primary"></i>
                                        <h3>Hazard assessment</h3>
                                        <p class="text-muted">
                                            Compare risks to help prioritize resources
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="feature-item">
                                        <i class="las la-balance-scale-left text-primary"></i>
                                        <h3>Tradeoffs and synergies</h3>
                                        <p class="text-muted">
                                            Identify benefits and consequences to help navigate conflicts
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-3">
                                    <div class="feature-item">
                                        <i class="las la-question-circle text-primary"></i>
                                        <h3>Learning opportunities</h3>
                                        <p class="text-muted">
                                            Identify untapped knowledge, known-unknowns, and unknown-unknowns
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="feature-item">
                                        <i class="las la-landmark text-primary"></i>
                                        <h3>Policy and management</h3>
                                        <p class="text-muted">
                                            Evaluate how policy and management impacts ecosystem services
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="feature-item">
                                        <i class="las la-leaf text-primary"></i>
                                        <h3>Stakeholder values</h3>
                                        <p class="text-muted">
                                            Assess how stakeholders value ecosystem services
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="feature-item">
                                        <i class="las la-calendar text-primary"></i>
                                        <h3>Alternative futures</h3>
                                        <p class="text-muted">
                                            Explore ecosystem services among future scenarios
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section-heading text-center">
                    <h2>Real-time Results, Clean Visualizations, Easy Creation</h2>
                </div>
                <div class="row">
                    <div class="col-lg-12 my-auto">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-lg-3">
                                    <div class="feature-item">
                                        <i class="lab la-buffer text-primary"></i>
                                        <h3>Built on Qualtrics</h3>
                                        <p class="text-muted">
                                            Use what you’re familiar with and build the surveys you want with Qualtrics
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="feature-item">
                                        <i class="las la-cogs text-primary"></i>
                                        <h3>Customizable</h3>
                                        <p class="text-muted">
                                            You pick the ecosystem services and assessment style
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="feature-item">
                                        <i class="las la-stopwatch text-primary"></i>
                                        <h3>Real-time</h3>
                                        <p class="text-muted">
                                            Visualize assessment results in seconds
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="feature-item">
                                        <i class="las la-chart-bar text-primary"></i>
                                        <h3>Clean visualizations</h3>
                                        <p class="text-muted">
                                            Intuitive visualizations from Data-Driven Documents (D3)
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-4">
                                    <div class="feature-item">
                                        <i class="las la-running text-primary"></i>
                                        <h3>Easy to start</h3>
                                        <p class="text-muted">
                                            Our user guide makes creating compatible surveys easy. Click
                                            <a href="./etc/User Guide IESAT_Version 1.0.pdf" target="_blank">here</a>
                                            for more
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="feature-item">
                                        <i class="las la-gift text-primary"></i>
                                        <h3>Free to use</h3>
                                        <p class="text-muted">
                                            IESAT is 100% free, you just need a Qualtrics brand administrator account
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="feature-item">
                                        <i class="las la-lock text-primary"></i>
                                        <h3>Secure</h3>
                                        <p class="text-muted">
                                            Your data is secure with ecoserve. Click
                                            <router-link to="/security">here</router-link> to learn more
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="cta">
            <div class="cta-content">
                <div class="container">
                    <h2>Stop waiting.<br />Start building.</h2>
                    <a href="./etc/User Guide IESAT_Version 1.0.pdf" target="_blank" class="btn btn-outline btn-xl"
                        >See our user guide</a
                    >
                </div>
            </div>
            <div class="overlay"></div>
        </section>
        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Credentials from "../api/amplifyConf";

export default {
    name: "home",
    components: {
        Header,
        Footer
    },
    data() {
        return {
            loginLink: Credentials.COGNITO_TOKEN_URL
        };
    },
    created() {
        window.scrollTo(0, 0);
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
@import "https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css";

h1,
h2,
h3,
h4,
h5,
h6 {
    font-weight: 200;
    letter-spacing: 1px;
}

p {
    font-size: 18px;
    line-height: 1.5;
    margin-bottom: 20px;
}

section {
    padding: 100px 0;
}

section h2 {
    font-size: 50px;
}

header.masthead.about.first {
    position: relative;
    min-height: 300px;
    height: 40vh;
    padding: 5vh 0 0 0;
    width: 100%;
    color: white;
    background: #364e32;
}

header.masthead.about.second {
    position: relative;
    width: 100%;
    padding-top: 150px;
    padding-bottom: 100px;
    color: white;
    background: url("../assets/bg-pattern.png"), linear-gradient(to left, #364e32, #98ba93);
}

header.masthead .header-content {
    max-width: 500px;
    margin-bottom: 100px;
    text-align: center;
}

header.masthead .header-content h1 {
    font-size: 30px;
    letter-spacing: 1px;
}

header.masthead .device-container {
    max-width: 325px;
    margin-right: auto;
    margin-left: auto;
}

@media (min-width: 992px) {
    header.masthead.first {
        min-height: 300px;
        height: 40vh;
        padding: 0;
    }
    header.masthead.second {
        height: 100vh;
        min-height: 775px;
        padding-top: 0;
        padding-bottom: 0;
    }
    header.masthead .header-content {
        margin-bottom: 0;
        text-align: left;
    }
    header.masthead .header-content h1 {
        font-size: 30px;
    }
    header.masthead .device-container {
        max-width: 325px;
    }
}

section.features .device-container,
section.features .feature-item {
    max-width: 325px;
    margin: 0 auto;
}

section.features .device-container {
    margin-bottom: 100px;
}

@media (min-width: 992px) {
    section.features .device-container {
        margin-bottom: 0;
    }
}

section.features .feature-item {
    padding-top: 50px;
    padding-bottom: 50px;
    text-align: center;
}

section.features .feature-item h3 {
    font-size: 30px;
}

section.features .feature-item i {
    font-size: 80px;
    display: block;
    margin-bottom: 15px;
    background: darkseagreen;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

section.cta {
    position: relative;
    padding: 250px 0;
    background-image: url("../assets/austin.jpg");
    background-position: center;
    background-size: cover;
}

section.cta .cta-content {
    position: relative;
    z-index: 1;
}

section.cta .cta-content h2 {
    font-size: 50px;
    max-width: 450px;
    margin-top: 0;
    margin-bottom: 25px;
    color: white;
}

@media (min-width: 768px) {
    section.cta .cta-content h2 {
        font-size: 80px;
    }
}

section.cta .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.btn-outline {
    color: white;
    border: 1px solid;
    border-color: white;
}

.btn-outline:hover,
.btn-outline:focus,
.btn-outline:active,
.btn-outline.active {
    color: white;
    border-color: darkseagreen;
    background-color: darkseagreen;
}

.btn {
    border-radius: 300px;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.btn-xl {
    font-size: 11px;
    padding: 15px 45px;
}

.device-mockup {
    position: relative;
    width: 100%;
}

.device-mockup > .device {
    position: absolute;
    top: -8rem;
    bottom: 0;
    left: -12rem;
    right: 0;
    width: 250%;
    height: 230%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.features .device-mockup > .device {
    position: absolute;
    top: -5.5rem;
    bottom: 0;
    left: -12rem;
    right: 0;
    width: 170%;
    height: 217%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.device-mockup.hero {
    padding-bottom: 57.5%;
}

.device-mockup.hero > .device {
    background-image: url("../assets/aboutHero.png");
}

a {
    color: #007bff;
}

a:focus,
a:hover {
    color: #0056b3;
}
</style>
