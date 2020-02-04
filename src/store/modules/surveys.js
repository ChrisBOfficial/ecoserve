import SurveysAPI from '@/api/surveys.js';

export default {
    namespaced: true,

    state: {
        surveys: [],
        surveysLoadStatus: 0,

        survey: {},
        surveyLoadStatus: 0,
        blocks: [],

        projectBlocks: {}
    },

    actions: {
        // Loads all surveys
        loadSurveys({commit}) {
            commit('setSurveysLoadStatus', 1);
            // Calls the API to load the surveys
            SurveysAPI.getSurveys()
                    .then(response => {
                        if (response.data.result && response.data.result.elements) {
                            console.log(response.data.result);
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
            // Calls the API to load a survey by surveyId and save the blocks
            SurveysAPI.getSurvey(data)
                    .then(response => {
                        console.log(response.data);
                        commit('setSurvey', response.data.result);
                        commit('setSurveyLoadStatus', 2);
                        var blocks = [];
                        var survey = response.data.result;
                        for (const block of survey.flow) {
                            var blockData = survey.blocks[block.id];
                            blockData.id = block.id;
                            blocks.push(blockData);
                        }
                        commit('setSurveyBlocks', blocks);
                    })
                    .catch(error => {
                        console.log(error);
                        commit('setSurvey', {});
                        commit('setSurveyLoadStatus', 3);
                    });
        },

        // Sets the Project's blocks
        saveProjectBlocks({commit}, data) {
            console.log(data);
            commit('setProjectBlocks', data);
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
        },
        // Sets the selected survey blocks
        setSurveyBlocks(state, blocks) {
            state.blocks = blocks;
        },
        // Sets the project blocks
        setProjectBlocks(state, blocks) {
            state.projectBlocks = blocks;
        }
    }
}