import SurveysAPI from '@/api/surveys.js';

export default {
    namespaced: true,

    state: {
        surveys: [],
        surveysLoadStatus: 0,

        survey: {},
        surveyLoadStatus: 0
    },

    actions: {
        // Loads all surveys
        loadSurveys({commit}) {
            commit('setSurveysLoadStatus', 1);
            // Calls the API to load the surveys
            SurveysAPI.getSurveys()
                    .then(response => {
                        if (response.data.result && response.data.result.elements) {
                            console.log(response.data);
                            commit('setSurveys', response.data.result.elements);
                            commit('setSurveysLoadStatus', 2);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        commit('setSurveys', []);
                        commit('setSurveysLoadStatus', 3);
                    });
        },

        // Loads a specific survey
        loadSurvey({commit}, data) {
            commit('setSurveyLoadStatus', 1);
            // Calls the API to load a survey by surveyId
            SurveysAPI.getSurvey(data)
                    .then(response => {
                        console.log(response.data);
                        commit('setSurvey', response.data.result);
                        commit('setSurveyLoadStatus', 2);
                    })
                    .catch(error => {
                        console.log(error);
                        commit('setSurvey', {});
                        commit('setSurveyLoadStatus', 3);
                    });
        }
    },

    mutations: {
        // Sets the surveys in the state
        setSurveys(state, surveys) {
            state.surveys = surveys;
        },
        // Sets the surveys load status
        setSurveysLoadStatus(state, status) {
            state.surveysLoadStatus = status;
        },
        // Sets the survey in the state
        setSurvey(state, survey) {
            state.survey = survey;
        },
        // Sets the survey load status
        setSurveyLoadStatus(state, status) {
            state.surveyLoadStatus = status;
        }
    }
}