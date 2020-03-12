<template>
    <div>
        <Header />
        <section style="padding: 3vh 0vh;">
            <header class="masthead">
                <div class="container d-flex h-100 align-items-center">
                    <div class="mx-auto text-center">
                        <h1 class="font-weight-light" style="color:white; letter-spacing: 0;">
                            Survey Creation Guidelines
                        </h1>
                    </div>
                </div>
            </header>

            <section class="showcase">
                <div class="container-fluid p-0">
                    <div class="row no-gutters">
                        <div
                            class="col-lg-4 text-white showcase-img"
                            style="background-image: url('etc/instructions/blockLabel.png');"
                        ></div>
                        <div class="col-lg-4 my-auto showcase-text">
                            <p class="lead mb-0">
                                Keep one question per block, and label these blocks as what you want to show up within
                                the Project Creation Form.
                            </p>
                        </div>
                        <div
                            class="col-lg-4 text-white showcase-img"
                            style="background-image: url('etc/instructions/blockLabel2.png');"
                        ></div>
                    </div>
                    <div class="row no-gutters">
                        <div
                            class="col-lg-4 text-white showcase-img"
                            style="background-image: url('etc/instructions/questionLabel.png');"
                        ></div>
                        <div class="col-lg-4 my-auto showcase-text">
                            <p class="lead mb-0">
                                Label questions as what you want for categories within visualizations.
                            </p>
                        </div>
                        <div
                            class="col-lg-4 text-white showcase-img"
                            style="background-image: url('etc/instructions/questionLabel2.png');"
                        ></div>
                    </div>
                    <div class="row no-gutters">
                        <div
                            class="col-lg-4 text-white showcase-img"
                            style="background-image: url('etc/instructions/options.png');"
                        ></div>
                        <div class="col-lg-4 my-auto showcase-text">
                            <p class="lead mb-0">
                                Use question type "Side by Side" and column option "Drop Down List". Have a maximum of
                                two columns.
                            </p>
                        </div>
                        <div
                            class="col-lg-4 text-white showcase-img"
                            style="background-image: url('etc/instructions/options2.png');"
                        ></div>
                    </div>
                    <div class="row no-gutters">
                        <div
                            class="col-lg-4 text-white showcase-img"
                            style="background-image: url('etc/instructions/recodeOption.png');"
                        ></div>
                        <div class="col-lg-4 my-auto showcase-text">
                            <p class="lead mb-0">
                                Go to Advanced Question Options and select Recode Values. Inside, check "Recode Values"
                                and "Question Export Tags".
                            </p>
                        </div>
                        <div
                            class="col-lg-4 text-white showcase-img"
                            style="background-image: url('etc/instructions/recodeOption2.png');"
                        ></div>
                    </div>
                    <div class="row no-gutters">
                        <div
                            class="col-lg-4 text-white showcase-img"
                            style="background-image: url('etc/instructions/yellowBox.png');"
                        ></div>
                        <div class="col-lg-4 my-auto showcase-text">
                            <p class="lead mb-0">
                                Enter the weight you want each choice to have in its yellow box. This affects the
                                choice's impact on the chart.
                            </p>
                        </div>
                        <div
                            class="col-lg-4 text-white showcase-img"
                            style="background-image: url('etc/instructions/yellowBox2.png');"
                        ></div>
                    </div>
                    <div class="row no-gutters">
                        <div
                            class="col-lg-4 text-white showcase-img"
                            style="background-image: url('etc/instructions/blueBox.png');"
                        ></div>
                        <div class="col-lg-4 my-auto showcase-text">
                            <p class="lead mb-0">
                                Enter in the leftmost blue boxes what you want to label the corresponding chart.
                            </p>
                        </div>
                        <div
                            class="col-lg-4 text-white showcase-img"
                            style="background-image: url('etc/instructions/blueBox2.png');"
                        ></div>
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
    name: "guidelines",
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

h1,
h2,
h3,
h4,
h5,
h6 {
    font-weight: 700;
}

header.masthead {
    position: relative;
    background-color: #343a40;
    background: url("/etc/main.jpg") no-repeat center center;
    background-size: cover;
    padding-top: 8rem;
    padding-bottom: 8rem;
    max-height: 1rem;
}

header.masthead .overlay {
    position: absolute;
    background-color: #212529;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    opacity: 0.3;
}

header.masthead h1 {
    font-size: 2rem;
}

@media (min-width: 768px) {
    header.masthead {
        padding-top: 12rem;
        padding-bottom: 12rem;
    }
    header.masthead h1 {
        font-size: 3rem;
    }
}

.showcase-img {
    border: 1px solid black;
    margin: 10px 0px;
}
</style>
