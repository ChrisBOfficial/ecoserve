<template>
    <div>
        <Header />
        <div class="container-fluid" style="margin-top: 20vh;">
            <div class="row">
                <div class="col-sm-8">
                    <h2>What is IESAT?</h2>
                    <br />
                    <p>
                        The Integrative Ecosystem Service Analysis Tool (IESAT) is an interactive web application that
                        uses stakeholder knowledge to create ecosystem service assessments. This tool was developed for
                        decision makers, managers, scientists, and other practitioners to better integrate traditional,
                        local, and expert knowledge sources into the environmental decision making process
                    </p>
                </div>
                <div class="col-sm-4">
                    <i class="las la-chalkboard-teacher text-primary"></i>
                </div>
            </div>
        </div>

        <div class="container-fluid bg-grey">
            <div class="row">
                <div class="col-sm-4">
                    <i class="las la-laptop-code text-primary"></i>
                </div>
                <div class="col-sm-8">
                    <h2>How can it be used?</h2>
                    <br />
                    <p>
                        The IESAT lets you pick the ecosystem services, assessment style, and visualizations. There are
                        two primary ways to visualize the data: in bar charts and flower diagrams (traditional ecosystem
                        service assessment). How the IESAT is used depends on the users needs and creativity. Some
                        example include:
                    </p>
                    <ul>
                        <li>
                            <strong>Integration of knowledge sources: </strong>Compare stakeholder assessments with the
                            state of the science or other stakeholder assessments to identify how these knowledge
                            sources complement each other.
                        </li>
                        <li>
                            <strong>Place based assessments: </strong>Compare ecosystem service provisioning among
                            properties, landscapes, countries, and continents
                        </li>
                        <li>
                            <strong>Hazard assessment: </strong>Compare risks to ecosystem services posed by multiple
                            factors (e.g., biological invasions, regime shifts, global change) to help prioritize
                            resources
                        </li>
                        <li>
                            <strong>Tradeoffs and synergies: </strong>Identify benefits and consequences to navigate the
                            decision making process
                        </li>
                        <li>
                            <strong>Learning opportunities: </strong>Identify untapped knowledge, known-unknowns, and
                            unknown-unknowns to help prioritize research needs and stakeholder engagement
                        </li>
                        <li>
                            <strong>Learning outcomes: </strong>Assess stakeholder learning with before and after
                            assessments by allowing participants to retake the survey
                        </li>
                        <li>
                            <strong>Policy and management: </strong>Evaluate how policy and management decisions impact
                            ecosystem services
                        </li>
                        <li><strong>Stakeholder values: </strong>Assess how stakeholders value ecosystem services</li>
                        <li><strong>Alternative futures: </strong>Explore ecosystem services among future scenarios</li>
                    </ul>
                    <p>
                        To learn how to create an account, connect to a qualtrics account, and start creating projects
                        see our user guide <router-link to="/guidelines">here</router-link>
                    </p>
                    <br />
                    <h2>How does it work?</h2>
                    <br />
                    <p>
                        The IESAT works alongside Qualtrics survey software. You design the survey following our
                        <router-link to="/guidelines">user guidelines</router-link> and IESAT builds user selected
                        visualizations in real-time as surveys are completed
                    </p>
                </div>
            </div>
        </div>

        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-8">
                    <h2>Who developed it?</h2>
                    <br />
                    <p>
                        The IESAT was created in collaboration between the Center for Resilience in Working Agricultural
                        Landscapes and the College of Engineering at the University of Nebraska, Lincoln. Funding for
                        this project was provided by Nebraska Game and Parks Commission W-125-R-1. The application was
                        developed by:
                    </p>
                    <ul>
                        <li>
                            Chris Burbach
                        </li>
                        <li>
                            Alexis Saltzman
                        </li>
                        <li>
                            Vy Doan
                        </li>
                        <li>
                            Stephen Ralph
                        </li>
                    </ul>
                </div>
                <div class="col-sm-4">
                    <i class="las la-users text-primary"></i>
                </div>
            </div>
        </div>
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
    },
    created() {
        window.scrollTo(0, 0);
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
@import "https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css";

i.las.text-primary {
    font-size: 15rem;
    color: darkseagreen !important;
}

.bg-grey {
    background-color: #f6f6f6;
}

.container-fluid {
    padding: 60px 50px;
}

.logo {
    font-size: 200px;
}

@media screen and (max-width: 768px) {
    .col-sm-4 {
        text-align: center;
        margin: 25px 0;
    }
}
</style>
