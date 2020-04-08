import ResponsesAPI from "@/api/responses.js";

let socketUrl;
if (process.env.NODE_ENV === "development") {
    socketUrl = "http://localhost:3000";
} else if (process.env.NODE_ENV === "production") {
    socketUrl = "https://ecoserve-app.com";
}

export default {
    namespaced: true,

    state: {
        responses: {},
        responsesLoadStatus: 0,

        hookLoadStatus: 0,

        barchartAggregate: [],
        circleAggregate: [],

        url: socketUrl
    },

    actions: {
        // Loads responses for a specific survey
        loadResponses({ commit }, data) {
            return new Promise((resolve, reject) => {
                commit("setResponsesLoadStatus", 1);
                ResponsesAPI.getResponses(data)
                    .then(response => {
                        commit("setResponses", response.data);
                        commit("setResponsesLoadStatus", 2);
                        resolve(response.data);
                    })
                    .catch(error => {
                        commit("setResponsesLoadStatus", 3);
                        reject(error);
                    });
            });
        },

        // Subscribes to survey updates for a given surveyId
        createHook({ commit }, data) {
            commit("setHookLoadStatus", 1);
            ResponsesAPI.registerHook(data)
                .then(response => {
                    console.log(response.data);
                    commit("setHookLoadStatus", 2);
                })
                .catch(error => {
                    commit("setHookLoadStatus", 3);
                    throw new Error(error);
                });
        },

        // Get aggregated response data for a given visualization
        async getAggregateData({ commit, dispatch }, data) {
            if (data.mode !== "static") await dispatch("loadResponses", data.id);
            return new Promise((resolve, reject) => {
                ResponsesAPI.getAggregateResponses(data.id, data.pipeline)
                    .then(response => {
                        if (data.pipeline === "barchart") {
                            commit("setBarchartAggregate", response.data);
                        } else if (data.pipeline === "circlechart") {
                            commit("setCircleAggregate", response.data);
                        } else if (data.pipeline === "label") {
                            commit("setLabelAggregate", response.data);
                        }
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }
    },

    mutations: {
        setResponses(state, responses) {
            state.responses = responses;
        },
        setResponsesLoadStatus(state, status) {
            state.responsesLoadStatus = status;
        },
        setHookLoadStatus(state, status) {
            state.hookLoadStatus = status;
        },
        setBarchartAggregate(state, data) {
            state.barchartAggregate = data;
        },
        setCircleAggregate(state, data) {
            state.circleAggregate = data;
        },
        setLabelAggregate(state, data) {
            state.labelAggregate = data;
        }
    }
};
