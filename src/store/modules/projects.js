import ProjectsAPI from "@/api/projects.js";

export default {
    namespaced: true,

    state: {
        projects: [],
        projectsLoadStatus: 0,
        projectBlocks: {},

        selectedProjectId: ""
    },

    actions: {
        loadProjects({ commit }) {
            return new Promise((resolve, reject) => {
                commit("setProjectsLoadStatus", 1);
                // Calls the API to load the projects
                ProjectsAPI.getProjects()
                    .then(response => {
                        if (response.data) {
                            commit("setProjects", response.data);
                            commit("setProjectsLoadStatus", 2);
                            resolve(response.data);
                        }
                    })
                    .catch(error => {
                        commit("setProjects", {});
                        commit("setProjectsLoadStatus", 3);
                        reject(error);
                    });
            });
        },
        saveProject({ commit, dispatch }, data) {
            return new Promise((resolve, reject) => {
                commit("setProjectsLoadStatus", 1);
                // Calls the API to save a project
                ProjectsAPI.postProject(data)
                    .then(response => {
                        if (response.data) {
                            dispatch("loadProjects");
                            resolve(response.data);
                        }
                    })
                    .catch(error => {
                        commit("setProjectsLoadStatus", 3);
                        reject(error);
                    });
            });
        },
        updateProject({ dispatch }, data) {
            // Calls the API to update a project
            ProjectsAPI.putProject(data)
                .then(response => {
                    if (response.data) {
                        dispatch("loadProjects");
                    }
                })
                .catch(error => {
                    throw new Error(error);
                });
        },
        deleteProject({ commit, dispatch }, data) {
            commit("setProjectsLoadStatus", 1);
            // Calls the API to delete a project
            ProjectsAPI.deleteProject(data)
                .then(response => {
                    if (response.data) {
                        dispatch("loadProjects");
                    }
                })
                .catch(error => {
                    commit("setProjectsLoadStatus", 3);
                    throw new Error(error);
                });
        },

        // Sets the Project's blocks
        saveProjectBlocks({ commit }, data) {
            commit("setProjectBlocks", data);
        }
    },

    mutations: {
        // Sets the projects in the state
        setProjects(state, projects) {
            state.projects = projects;
        },
        // Sets the projects load status
        setProjectsLoadStatus(state, status) {
            state.projectsLoadStatus = status;
        },
        // Sets the project blocks
        setProjectBlocks(state, blocks) {
            state.projectBlocks = blocks;
        },
        // Sets the surveyId of the selected project
        setSelectedProjectId(state, newId) {
            state.selectedProjectId = newId;
        }
    }
};
