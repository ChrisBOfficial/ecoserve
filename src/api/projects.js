export default {
    // Get all projects
    getProjects() {
        return window.axios.get("/projects");
    },

    // Add a project
    postProject(project) {
        return window.axios.post("/projects", project);
    },

    // Update a project
    putProject(project) {
        return window.axios.put("/projects", project);
    },

    // Delete a project
    deleteProject(project) {
        return window.axios.delete("/projects", { data: project });
    }
};
