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
        // Load all projects from MongoDB
        loadProjects({ commit }) {
            return new Promise((resolve, reject) => {
                commit("setProjectsLoadStatus", 1);
                ProjectsAPI.getProjects()
                    .then(response => {
                        if (response.data) {
                            commit("setProjects", response.data);
                            commit("setProjectsLoadStatus", 2);
                            resolve(response.data);
                            console.log(response.data);
                        }
                    })
                    .catch(error => {
                        commit("setProjects", {});
                        commit("setProjectsLoadStatus", 3);
                        reject(error);
                    });
            });
        },
        // Save a project to MongoDB
        saveProject({ commit, dispatch }, data) {
            return new Promise((resolve, reject) => {
                commit("setProjectsLoadStatus", 1);
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
        // Update a project in MongoDB
        updateProject({ dispatch }, data) {
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
        // Delete a proejct in MongoDB
        deleteProject({ commit, dispatch }, data) {
            commit("setProjectsLoadStatus", 1);
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

        saveProjectBlocks({ commit }, data) {
            commit("setProjectBlocks", data);
        }
    },

    mutations: {
        setProjects(state, projects) {
            state.projects = projects;
        },
        setProjectsLoadStatus(state, status) {
            state.projectsLoadStatus = status;
        },
        setProjectBlocks(state, blocks) {
            state.projectBlocks = blocks;
        },
        setSelectedProjectId(state, newId) {
            state.selectedProjectId = newId;
        }
    }
};
