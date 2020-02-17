<template>
    <b-container>
        <b-row>
            <h3>Pick Survey From Qualtrics</h3>
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
    created: function() {
        this.loadSurveys();
    },
    methods: {
        ...mapActions({
            loadSurveys: "surveys/loadSurveys",
            loadSurvey: "surveys/loadSurvey"
        }),
        selectSurvey: function(selected) {
            this.loadSurvey(selected.id);
        }
    }
};
</script>
