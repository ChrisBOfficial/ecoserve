<template>
    <b-container>
        <b-row>
            <h4>Pick Survey From Qualtrics</h4>
        </b-row>
        <b-row class="align-items-center">
            <b-form-select v-model="selectedSurvey" v-on:change="selectSurvey" :select-size="5">
                <option v-for="survey in surveys" v-bind:value="survey" v-bind:key="survey.name">
                    {{ survey.name }}
                </option>
            </b-form-select>
            <br />
        </b-row>
    </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
    name: "surveyBlocks",
    data() {
        return {
            selectedSurvey: ""
        };
    },
    computed: {
        ...mapState({
            surveys: state => state.surveys.surveys,
            survey: state => state.surveys.survey,
            blocks: state => state.surveys.blocks
        })
    },
    async created() {
        if (!window.axios.defaults.headers["x-api-token"] && !window.axios.defaults.headers["q-data-center"]) {
            await new Promise(r => setTimeout(r, 550));
        }
        this.loadSurveys();
    },
    methods: {
        ...mapActions({
            loadSurveys: "surveys/loadSurveys",
            loadSurvey: "surveys/loadSurvey"
        }),
        selectSurvey(selected) {
            this.loadSurvey(selected.id);
        }
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
</style>
