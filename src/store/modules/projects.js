import ProjectsAPI from '@/api/projects.js';

export default {
    namespaced: true,

    state: {
        projects: [],
        projectsLoadStatus: 0
    },

    actions: {
        // Loads all projects
        loadProjects({commit}) {
            commit('setProjectsLoadStatus', 1);
            // Calls the API to load the projects
            ProjectsAPI.getProjects()
                    .then(response => {
                        if (response.data) {
                            console.log(response.data);
                            commit('setProjects', response.data);
                            commit('setProjectsLoadStatus', 2);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        commit('setProjects', {});
                        commit('setProjectsLoadStatus', 3);
                    });
        },
        saveProject({commit}, data) {
            commit('setProjectsLoadStatus', 1);
            // Calls the API to save a project
            ProjectsAPI.postProject(data)
                    .then(response => {
                        if (response.data) {
                            console.log(response.data);
                            commit('setProjects', response.data);
                            commit('setProjectsLoadStatus', 2);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        commit('setProjectsLoadStatus', 3);
                    });
        },
        deleteProject({commit}, data) {
            commit('setProjectsLoadStatus', 1);
            // Calls the API to delete a project
            ProjectsAPI.deleteProject(data)
                    .then(response => {
                        if (response.data) {
                            console.log(response.data);
                            commit('setProjects', response.data);
                            commit('setProjectsLoadStatus', 2);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        commit('setProjectsLoadStatus', 3);
                    })
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
        }
    }
}