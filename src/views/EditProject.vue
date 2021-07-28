<template>
    <div>
        <Header />
        <section class="existing-project-container" style="padding: 15vh 0vh 0vh 0vh; min-height:100vh;">
            <b-container>
                <b-row class="h-100">
                    <h1>{{ title }}</h1>
                </b-row>
                <b-row>
                    <h4>Survey name: {{ this.selectedSurvey.name }}</h4>
                </b-row>
                <b-row>
                    <b-form-input v-model.trim="title" placeholder="Enter Project Title"></b-form-input>
                    <b-form-input v-model.trim="description" placeholder="Enter Project Description"></b-form-input>
                </b-row>
                <b-row>
                    <visualization-dashboard
                        v-bind:existing-visualizations="visualizations"
                        v-bind:existing-blocks="existingBlocks"
                    />
                </b-row>

                <b-row align-h="center" style="margin-bottom: 1rem;">
                    <b-col class="col-3">
                        <b-button @click="downloadJSON" style="background-color: DarkSeaGreen; font-size: 10px;">
                            {{ downloadText }}
                        </b-button>
                    </b-col>
                    <b-col class="col-3">
                        <div class="dropbox">
                            <input class="input-file" type="file" ref="file" accept=".json" @change="uploadJSON" />
                            <p>
                                {{ uploadText }}
                            </p>
                        </div>
                    </b-col>
                    <b-col class="col-3">
                        <b-button v-b-modal.modal-center-1 style="background-color: #dc3545; font-size: 10px;">
                            Delete comparison data
                        </b-button>
                        <b-modal
                            id="modal-center-1"
                            centered
                            title="Warning"
                            ok-variant="danger"
                            ok-title="Yes"
                            cancel-title="No"
                            :hide-header-close="true"
                            v-on:ok="deleteComparison"
                        >
                            <p class="my-4">Are you sure you want to delete the comparison data?</p>
                        </b-modal>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-button
                            v-on:click="saveProject"
                            style="background-color: DarkSeaGreen;"
                            v-b-modal.modal-center-2
                            >SAVE PROJECT</b-button
                        >
                        <b-modal
                            id="modal-center-2"
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
                        <router-link
                            :to="{ name: 'dashboard', query: { id: project.projectId, view: 'live' } }"
                            tag="b-button"
                            style="background-color:DarkSeaGreen;"
                            >Go To Visualization</router-link
                        >
                    </b-col>
                    <b-col>
                        <b-button style="background-color: #dc3545;" v-b-modal.modal-center-3>DELETE PROJECT</b-button>
                        <b-modal
                            id="modal-center-3"
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
import { mapActions, mapState } from "vuex";

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
            uploadText: "Drag comparison data or browse",
            downloadText: "",
            visualizations: [],
            existingBlocks: [],
            comparisonData: [],
            validateErrors: [],
            previousProjectId: "",
            hookStatus: Boolean
        };
    },
    computed: {
        ...mapState({
            project: state => state.projects.project,
            projectBlocks: state => state.projects.projectBlocks,
            selectedSurvey: state => state.surveys.survey
        })
    },
    async created() {
        window.scrollTo(0, 0);
        window.onbeforeunload = () => true;
        if (!window.axios.defaults.headers["x-api-token"] && !window.axios.defaults.headers["q-data-center"]) {
            await new Promise(r => setTimeout(r, 550));
        }
        await this.loadProject(this.$route.query.id);
        this.loadSurvey(this.project.surveyId);

        this.populateForm();
    },
    destroyed() {
        window.onbeforeunload = null;
    },
    methods: {
        ...mapActions({
            loadProject: "projects/loadProject",
            updateProject: "projects/updateProject",
            removeProject: "projects/deleteProject",
            loadSurvey: "surveys/loadSurvey"
        }),
        populateForm() {
            this.title = this.project.name;
            this.description = this.project.description;
            this.existingBlocks = this.project.blocks;

            for (const block of this.project.blocks) {
                for (const graph of block.visuals) {
                    this.visualizations.push(block.title + " - " + graph);
                }
            }

            this.comparisonData = this.project.comparisonData;
            if (this.comparisonData.length > 0) {
                this.downloadText = "Download previous data";
            } else {
                this.downloadText = "Download data template";
            }

            this.previousProjectId = this.project.projectId;
            this.hookStatus = this.project.hooked;
        },
        validateForm(bvModalEvt) {
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
            if (this.project.surveyId === undefined) {
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
        saveProject() {
            if (this.validateForm()) {
                const payload = {
                    previousId: this.previousProjectId,
                    data: {
                        accountToken: window.axios.defaults.headers["x-api-token"],
                        name: this.title,
                        description: this.description,
                        surveyId: this.project.surveyId,
                        projectId: this.project.projectId,
                        blocks: this.projectBlocks,
                        comparisonData: this.comparisonData,
                        hooked: this.hookStatus
                    }
                };
                this.updateProject(payload).then(() => {
                    this.loadProject(this.$route.query.id).then(() => {
                        this.visualizations = [];
                        this.populateForm();
                    });
                });
            }
        },
        exitEditing() {
            this.$router.push("projects");
        },
        deleteComparison() {
            this.comparisonData = [];
        },
        deleteProject() {
            const payload = {
                projectId: this.project.projectId,
                accountToken: window.axios.defaults.headers["x-api-token"]
            };
            this.removeProject(payload);
            this.exitEditing();
        },
        downloadJSON() {
            let exportObj = [];
            if (this.project.comparisonData.length > 0) {
                exportObj = this.project.comparisonData;
            } else {
                const questions = this.selectedSurvey.questions;

                for (let question in this.selectedSurvey.questions) {
                    let data = [];

                    let subQuestions = questions[question].subQuestions;
                    let questionName = questions[question].questionName;
                    for (let key in subQuestions) {
                        let dataObj = { subname: subQuestions[key].description, max: 0, min: 0 };
                        data.push(dataObj);
                    }
                    let questionObj = { questionName: questionName, data: data };
                    exportObj.push(questionObj);
                }
            }

            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 4));
            let jsonElement = document.createElement("a");

            jsonElement.setAttribute("href", dataStr);
            jsonElement.setAttribute("download", "comparison.json");
            document.body.appendChild(jsonElement);
            jsonElement.click();
            jsonElement.remove();
        },
        uploadJSON() {
            const file = this.$refs.file.files[0];
            this.uploadText = "File: " + file.name;

            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                this.comparisonData = JSON.parse(reader.result);
            };
            reader.onerror = e => {
                console.log(e);
            };
        }
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
</style>
