<template>
    
</template>

<script>

export default {
    name: "surveyBlocks",
    data() {
        return {
            blocks: []
        }
    },
    props: { surveyId: String },
    watch: {
        surveyId: function(newVal, oldVal) {
            this.getBlocks(newVal);
        }
    },
    created: function() {
        this.getBlocks(this.surveyId);
    },
    methods: {
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
