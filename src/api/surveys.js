export default {
    // Get all surveys
    getSurveys() {
        return window.axios.get('/surveys');
    },

    // Get a specific survey
    getSurvey(surveyId) {
        return window.axios.get('/surveys?surveyId=' + surveyId);
    }
}