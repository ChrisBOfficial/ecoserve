export default {
    // Get all responses for a specific survey
    getResponses(surveyId) {
        return window.axios.get('/surveys/responses?surveyId=' + surveyId);
    },

    // Register a hook for survey updates on a specific survey
    registerHook(surveyId) {
        return window.axios.post('/surveys/responses?surveyId=' + surveyId);
    }
}