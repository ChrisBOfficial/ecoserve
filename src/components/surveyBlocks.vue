<template>
    
</template>

<script>

export default {
    name: "surveyBlocks",
    data() {
        return {
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
