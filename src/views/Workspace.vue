<template>
    <div>
        <Header />
        <div class="container" style="padding:10px 10px;">
            <div class="well" style="padding-top: 136px;">
                <button
                    style="background-color:DarkSeaGreen;"
                    v-on:click="getSpecificSurvey('SV_b78ghjEDgpEZU3j', ...arguments)"
                >
                    Log survey SV_b78ghjEDgpEZU3j
                </button>
                <div style="width: 50%; margin: 0 auto;">
                    <button
                        style="background-color:DarkSeaGreen;"
                        v-for="survey in formattedSurveys"
                        :key="survey.name"
                    >
                        {{ survey.name }}
                    </button>
                </div>
                <button style="background-color:DarkSeaGreen;" v-on:click="loadSurveys">Refresh surveys</button>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { mapActions, mapState } from "vuex";
import io from "socket.io-client";

export default {
    data() {
        return {
            socket: {},
            lastUpdate: 0
        };
    },
    computed: {
        ...mapState({
            surveys: state => state.surveys.surveys,
            survey: state => state.surveys.survey,
            socketUrl: state => state.responses.url
        }),
        formattedSurveys: function() {
            var formattedList = [];
            this.surveys.forEach(function(survey, index) {
                var surveyName = "Survey " + (index + 1) + " - " + survey.name;
                formattedList.push({ displayName: surveyName, id: survey.id, name: survey.name });
            });
            return formattedList;
        }
    },
    components: {
        Header,
        Footer
    },
    created: function() {
        this.lastUpdate = Date.now();
        this.loadSurveys();
        this.getResponses("SV_b78ghjEDgpEZU3j");

        this.socket = io(this.socketUrl);
        this.socket.on(
            "SV_b78ghjEDgpEZU3j",
            function(msg) {
                if (Date.now() - this.lastUpdate >= 5000) {
                    this.lastUpdate = Date.now();
                    console.log(msg);
                }
            }.bind(this)
        );
        // this.createHook('SV_3yOO65TG4UFqw6N');
        // https://ssp.qualtrics.com/jfe/form/SV_3yOO65TG4UFqw6N
    },
    destroyed: function() {
        this.socket.close();
    },
    methods: {
        ...mapActions({
            loadSurveys: "surveys/loadSurveys",
            loadSurvey: "surveys/loadSurvey",
            getResponses: "responses/loadResponses",
            createHook: "responses/createHook"
        }),
        getSpecificSurvey: function(surveyId) {
            this.loadSurvey(surveyId);
        }
    }
};
</script>
