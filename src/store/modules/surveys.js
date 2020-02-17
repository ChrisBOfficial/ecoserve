import SurveysAPI from "@/api/surveys.js";

export default {
    namespaced: true,

    state: {
        surveys: [],
        surveysLoadStatus: 0,

        survey: {},
        surveyLoadStatus: 0,
        blocks: [],
        questions: []
    },

    actions: {
        // Loads all surveys
        loadSurveys({ commit }) {
            return new Promise((resolve, reject) => {
                commit("setSurveysLoadStatus", 1);
                SurveysAPI.getSurveys()
                    .then(response => {
                        if (response.data.result && response.data.result.elements) {
                            commit("setSurveys", response.data.result.elements);
                            commit("setSurveysLoadStatus", 2);
                            resolve();
                        }
                    })
                    .catch(error => {
                        commit("setSurveys", []);
                        commit("setSurveysLoadStatus", 3);
                        reject(error);
                    });
            });
        },

        // Loads a specific survey
        loadSurvey({ commit }, data) {
            return new Promise((resolve, reject) => {
                commit("setSurveyLoadStatus", 1);
                SurveysAPI.getSurvey(data)
                    .then(response => {
                        commit("setSurvey", response.data.result);
                        commit("setSurveyLoadStatus", 2);

                        let blocks = [];
                        let survey = response.data.result;
                        for (const block of survey.flow) {
                            let blockData = survey.blocks[block.id];
                            blockData.id = block.id;
                            blocks.push(blockData);
                        }
                        commit("setSurveyBlocks", blocks);

                        let questions = [];
                        for (const questionId in survey.questions) {
                            if (survey.questions[questionId].questionType.type === "SBS") {
                                let questionData = { ID: questionId, sub: [] };
                                for (const subQuestionId in survey.questions[questionId].subQuestions) {
                                    let subData = {
                                        subID: subQuestionId,
                                        subtext: survey.questions[questionId].subQuestions[subQuestionId].choiceText
                                    };
                                    questionData.sub.push(subData);
                                }
                                questions.push(questionData);
                            }
                        }
                        commit("setSurveyQuestions", questions);
                        resolve();
                    })
                    .catch(error => {
                        commit("setSurvey", {});
                        commit("setSurveyLoadStatus", 3);
                        reject(error);
                    });
            });
        }
    },

    mutations: {
        setSurveys(state, surveys) {
            state.surveys = surveys;
        },
        setSurveysLoadStatus(state, status) {
            state.surveysLoadStatus = status;
        },
        setSurvey(state, survey) {
            state.survey = survey;
        },
        setSurveyLoadStatus(state, status) {
            state.surveyLoadStatus = status;
        },
        setSurveyBlocks(state, blocks) {
            state.blocks = blocks;
        },
        setSurveyQuestions(state, questions) {
            state.questions = questions;
        }
    }
};
