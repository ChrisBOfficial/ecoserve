<template>
    <b-container>
        <b-row>
            <h3>Pick Survey From Qualtrics</h3>
        </b-row>
        <b-row class="align-items-center">
            <b-form-select v-model="selectedSurvey" :select-size="4">
                <option v-for="survey in surveys" v-bind:value="survey" v-bind:key="survey" >
                </option>
            </b-form-select>
            <br>
            <span>Selected: {{selectedSurvey}}</span>
        </b-row>
        <b-row>
            <button style="background-color:DarkSeaGreen;">CHOOSE SURVEY</button>
        </b-row>
    </b-container>
</template>

<script>

export default {
    name: "surveyBlocks",
    data() {
        return {
            selectedSurvey: '',
            surveys: [],
            blocks: []
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
                this.surveys = res.elements;
            }.bind(this));
        },
        getBlocks: function(surveyId) {
            this.blocks = [];
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
                    this.blocks.push(survey.blocks[block.id].description);
                }
            }.bind(this));
        }
    }
}

</script>
