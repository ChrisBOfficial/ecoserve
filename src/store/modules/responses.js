import ResponsesAPI from "@/api/responses.js";

export default {
    namespaced: true,

    state: {
        responses: {},
        responsesLoadStatus: 0,

        hookLoadStatus: 0,

        dummy: {
            Species: [
                {
                    label: "1",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "2",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "3",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "4",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "5",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "6",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "7",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "8",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "9",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                }
            ]
        },

        barchartAggregate: [],
        circleAggregate: [],
        labelAggregate: []
    },

    actions: {
        // Loads responses for a specific survey
        loadResponses({ commit }, data) {
            commit("setResponsesLoadStatus", 1);
            // Calls the API to load the responses
            ResponsesAPI.getResponses(data)
                .then(response => {
                    console.log(response.data);
                    commit("setResponses", response.data);
                    commit("setResponsesLoadStatus", 2);
                })
                .catch(error => {
                    console.log(error);
                    commit("setResponsesLoadStatus", 3);
                });
        },

        // Subscribes to survey updates for a given surveyId
        createHook({ commit }, data) {
            commit("setHookLoadStatus", 1);
            ResponsesAPI.registerHook(data)
                .then(response => {
                    if (response.data) {
                        console.log(response.data);
                    } else {
                        console.log(response);
                    }
                    commit("setHookLoadStatus", 2);
                })
                .catch(error => {
                    console.log(error);
                    commit("setHookLoadStatus", 3);
                });
        },

        // Get aggregated response data for a given visualization
        getAggregateData({ commit }, data) {
            ResponsesAPI.getAggregateResponses(data.id, data.pipeline)
                .then(response => {
                    if (data.pipeline === "barchart") {
                        commit("setBarchartAggregate", response.data);
                    } else if (data.pipeline === "circlechart") {
                        commit("setCircleAggregate", response.data);
                    } else if (data.pipeline === "label") {
                        commit("setLabelAggregate", response.data);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },

    mutations: {
        // Sets the responses in the state
        setResponses(state, responses) {
            state.responses = responses;
        },
        // Sets the responses load status
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
