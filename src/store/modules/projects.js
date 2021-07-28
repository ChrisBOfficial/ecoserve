import ProjectsAPI from "@/api/projects.js";

export default {
    namespaced: true,

    state: {
        projects: [],
        projectsLoadStatus: 0,

        project: {},
        projectBlocks: [],
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
                        }
                    })
                    .catch(error => {
                        commit("setProjects", {});
                        commit("setProjectsLoadStatus", 3);
                        reject(error);
                    });
            });
        },

        // Load a specific project
        loadProject({ commit }, data) {
            return new Promise((resolve, reject) => {
                ProjectsAPI.getProject(data.split("+")[0], data.split("+")[1])
                    .then(response => {
                        commit("setProject", response.data);
                        commit("setProjectBlocks", response.data.blocks);
                        resolve();
                    })
                    .catch(err => {
                        commit("setProject", {});
                        reject(err);
                    });
            });
        },

        // Save a project to MongoDB
        createProject({ commit, dispatch }, data) {
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
        // Delete a project in MongoDB
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
        setProject(state, project) {
            state.project = project;
        },
        setSelectedProjectId(state, newId) {
            state.selectedProjectId = newId;
        },
        setProjectBlocks(state, blocks) {
            state.projectBlocks = blocks;
        }
    }
};
