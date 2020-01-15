<template>
    <b-container>
        <b-row>
            <h3>Pick Survey From Qualtrics</h3>
        </b-row>
        <b-row class="align-items-center">
            <b-form-select v-model="selectedSurvey" :select-size="4">
                <option v-for="survey in surveys" v-bind:value="survey" v-bind:key="survey" >{{ survey.name }}</option>
            </b-form-select>
            <br>
            <span>Selected: {{selectedSurvey}} </span>
        </b-row>
        <b-row>
            <button @click="getBlocks(selectedSurvey.id)" style="background-color:DarkSeaGreen;">CHOOSE SURVEY</button>
        </b-row>
    </b-container>
</template>

<script>

var request = require('request');

export default {
    name: "surveyBlocks",
    data() {
        return {
            selectedSurvey: '',
            surveys: []
        }
    },
    created: function() {
        this.getSurveys();
    },
    methods: {
        getSurveys: function() {
            var options = {
                method: 'GET',
                url: window.location.origin + '/api/surveys',
                headers: {
                    'x-api-token': process.env.VUE_APP_Q_API_TOKEN
                }
            };
            request(options, function(error, response, body) {
                if (error) throw new Error(error);
                var res = JSON.parse(body).result;
                console.log(body);
                this.surveys = res.elements;
            }.bind(this));
        },
        getBlocks: function(surveyId) {
            this.$store.state.blocks = [];
            var options = {
                method: 'GET',
                url: window.location.origin + '/api/surveys?surveyId=' + surveyId,
                headers: {
                    'x-api-token': process.env.VUE_APP_Q_API_TOKEN
                }
            };
            request(options, function(error, response, body) {
                if (error) throw new Error(error);
                var survey = JSON.parse(body).result;
                for (const block of survey.flow) {
                    var blockData = survey.blocks[block.id];
                    blockData.id = block.id;
                    this.$store.state.blocks.push(blockData);
                }
            }.bind(this));

            this.selectedSurvey = '';
        }
    }
}

</script>
