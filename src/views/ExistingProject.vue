<template>
    <div>
        <Header />
        <section class="existing-project-container" style="padding: 15vh 0vh 0vh 0vh; min-height:100vh;">
            <b-container v-show="seen">
                <b-row>
                    <b-form-select v-model="selected" :select-size="5">
                        <option v-for="project in projects" :value="project" :key="project.name">
                            {{ project.name }}
                        </option>
                    </b-form-select>
                </b-row>
                <b-row>
                    <b-button v-on:click="selectProject" style="background-color:DarkSeaGreen;">
                        Choose project
                    </b-button>
                </b-row>
            </b-container>

            <b-container v-show="projectPicked">
                <b-row class="h-100">
                    <h1 aria-placeholder="CREATE NEW PROJECT">{{ title }}</h1>
                </b-row>
                <b-row>
                    <h4>Survey: "{{ this.selectedSurvey.name }}"</h4>
                </b-row>
                <b-row>
                    <b-form-input v-model="title" placeholder="Enter Project Title"></b-form-input>
                    <b-form-input v-model="description" placeholder="Enter Project Description"></b-form-input>
                </b-row>
                <b-row>
                    <h2>Visualization Dashboard</h2>
                    <visualization-dashboard
                        v-bind:existing-visualizations="visualizations"
                        v-bind:existing-blocks="existingBlocks"
                    />
                </b-row>

                <b-row>
                    <b-col>
                        <b-button
                            v-on:click="saveProject"
                            style="background-color:DarkSeaGreen;"
                            v-b-modal.modal-center-1
                            >SAVE PROJECT</b-button
                        >
                        <b-modal
                            id="modal-center-1"
                            centered
                            :hide-header="true"
                            size="sm"
                            @show="validateForm"
                            ok-title="Go to Projects"
                            cancel-title="Continue editing"
                            v-on:ok="exitEditing"
                        >
                            <p class="my-4" style="text-align: center;">Project saved!</p>
                        </b-modal>
                    </b-col>
                    <b-col>
                        <b-button style="background-color:DarkSeaGreen;" v-b-modal.modal-center-2
                            >DELETE PROJECT</b-button
                        >
                        <b-modal
                            id="modal-center-2"
                            centered
                            title="Warning"
                            ok-variant="danger"
                            ok-title="Yes"
                            cancel-title="No"
                            :hide-header-close="true"
                            v-on:ok="deleteProject"
                        >
                            <p class="my-4">Are you sure you want to delete the project?</p>
                        </b-modal>
                    </b-col>
                    <b-col>
                        <router-link
                            :to="{ name: 'dashboard', query: { id: selected.projectId } }"
                            tag="b-button"
                            style="background-color:DarkSeaGreen;"
                            >Go To Visualization</router-link
                        >
                    </b-col>
                </b-row>
            </b-container>
            <p style="text-align: center; color: red;" v-for="error in validateErrors" :key="error">{{ error }}</p>
        </section>
        <Footer />
    </div>
</template>

<script>
import VisualizationDashboard from "@/components/VisualizationDashboard.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
    components: {
        Header,
        VisualizationDashboard,
        Footer
    },
    data() {
        return {
            title: "",
            description: "",
            projectPicked: false,
            seen: true,
            selected: {},
            visualizations: [],
            existingBlocks: [],
            validateErrors: [],
            previousProjectId: ""
        };
    },
    computed: {
        ...mapState({
            projects: state => state.projects.projects,
            projectBlocks: state => state.projects.projectBlocks,
            selectedSurvey: state => state.surveys.survey
        }),
        projectNames: function() {
            let names = [];
            for (const project of this.projects) {
                names.push(project.name);
            }
            return names;
        }
    },
    created: function() {
        this.loadProjects();
    },
    methods: {
        ...mapActions({
            loadProjects: "projects/loadProjects",
            updateProject: "projects/updateProject",
            removeProject: "projects/deleteProject",
            saveProjectBlocks: "projects/saveProjectBlocks",
            loadSurvey: "surveys/loadSurvey"
        }),
        ...mapMutations({
            setSelectedId: "projects/setSelectedProjectId"
        }),
        selectProject: function() {
            // Prevent showing edit form if no project is selected
            if (Object.entries(this.selected).length !== 0) {
                this.title = this.selected.name;
                this.description = this.selected.description;
                this.projectPicked = !this.projectPicked;
                this.seen = !this.seen;
                this.loadSurvey(this.selected.surveyId);
                this.saveProjectBlocks(this.selected.blocks);

                this.existingBlocks = this.selected.blocks;
                for (const block of this.selected.blocks) {
                    for (const graph of block.visuals) {
                        this.visualizations.push(block.title + " - " + graph);
                    }
                }
                this.previousProjectId = this.selected.projectId;
                this.setSelectedId(this.selected.projectId);
            }
        },
        validateForm: function(bvModalEvt) {
            let invalid = false;
            this.validateErrors = [];
            let blocks = JSON.parse(JSON.stringify(this.projectBlocks));

            if (this.title === "") {
                this.validateErrors.push("Please provide a title");
                invalid = true;
            }
            if (this.description === "") {
                this.validateErrors.push("Please provide a description");
                invalid = true;
            }
            if (this.selected.surveyId === undefined) {
                this.validateErrors.push("Project requires a survey");
                invalid = true;
            }
            if (blocks.length === 0) {
                this.validateErrors.push("Project requires at least one visualization");
                invalid = true;
            }
            if (invalid) {
                if (bvModalEvt) bvModalEvt.preventDefault();
                return false;
            } else {
                this.$bvModal.show("modal-center");
                return true;
            }
        },
        saveProject: function() {
            if (this.validateForm()) {
                const payload = {
                    previousId: this.previousProjectId,
                    data: {
                        name: this.title,
                        description: this.description,
                        surveyId: this.selected.surveyId,
                        projectId: this.title + "+" + this.selected.surveyId,
                        blocks: this.projectBlocks,
                        hooked: false
                    }
                };
                this.updateProject(payload);
            }
        },
        exitEditing: function() {
            this.$router.push("project");
        },
        deleteProject: function() {
            const payload = {
                projectId: this.title + "+" + this.selected.surveyId
            };
            this.removeProject(payload);
            this.exitEditing();
        }
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
@import "https://fonts.googleapis.com/css?family=Varela+Round";
@import "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i";
</style>
