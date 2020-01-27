export default {
    // Get all responses for a specific survey
    getResponses(surveyId) {
        return window.axios.get('/surveys/responses?surveyId=' + surveyId);
    }
}