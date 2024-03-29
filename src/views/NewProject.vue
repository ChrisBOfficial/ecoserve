<template>
    <div class="new-project-container" style="padding: 15vh 0vh 0vh 0vh;">
        <Header />
        <b-container>
            <b-row class="h-100">
                <h1>{{ title }}</h1>
            </b-row>
            <b-row>
                <b-form-input v-model.trim="title" placeholder="Enter Project Title"></b-form-input>
                <b-form-input v-model.trim="description" placeholder="Enter Project Description"></b-form-input>
            </b-row>
            <b-row>
                <h4>Create New Survey</h4>
            </b-row>
            <b-row class="align-items-center">
                <b-button href="https://login.qualtrics.com/login" target="_blank">Link to Qualtrics</b-button>
            </b-row>

            <b-row>
                <survey-blocks @survey-picked="selected = true" />
            </b-row>
            <b-row>
                <visualization-dashboard />
            </b-row>

            <b-row align-h="center" style="margin-bottom: 1rem;" v-if="selected">
                <b-col class="col-4">
                    <b-button @click="downloadJSON" style="background-color:DarkSeaGreen;"
                        >Download Data Template</b-button
                    >
                </b-col>
                <b-col class="col-4">
                    <div class="dropbox">
                        <input class="input-file" type="file" ref="file" accept=".json" @change="uploadJSON" />
                        <p>
                            {{ uploadText }}
                        </p>
                    </div>
                </b-col>
            </b-row>

            <b-row align-h="center">
                <b-col class="col-5">
                    <b-button style="background-color:DarkSeaGreen;" v-b-modal.modal-center>CREATE PROJECT</b-button>
                    <b-modal
                        id="modal-center"
                        @show="validateForm"
                        @hide="createProject"
                        centered
                        :hide-header="true"
                        size="sm"
                        :no-close-on-backdrop="true"
                        :no-close-on-esc="true"
                        :ok-only="true"
                    >
                        <p style="text-align: center;">Project created!</p>
                    </b-modal>
                </b-col>
            </b-row>
        </b-container>
        <p style="text-align: center; color: red;" v-for="error in validateErrors" :key="error">{{ error }}</p>
        <Footer />
    </div>
</template>

<script>
import VisualizationDashboard from "@/components/VisualizationDashboard.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import surveyBlocks from "@/components/surveyBlocks.vue";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
    components: {
        Header,
        Footer,
        VisualizationDashboard,
        surveyBlocks
    },
    data() {
        return {
            title: "",
            description: "",
            validateErrors: [],
            selected: false,
            uploadText: "Drag comparison data or click to browse",
            comparisonData: []
        };
    },
    computed: {
        ...mapState({
            survey: state => state.surveys.survey,
            projectBlocks: state => state.projects.projectBlocks
        })
    },
    created() {
        window.scrollTo(0, 0);
        window.onbeforeunload = () => true;
        this.setSurvey({});
        this.setProjectBlocks([]);
    },
    destroyed() {
        window.onbeforeunload = null;
    },
    methods: {
        ...mapActions({
            loadSurveys: "surveys/loadSurveys",
            loadSurvey: "surveys/loadSurvey",
            createProject: "projects/createProject"
        }),
        ...mapMutations({
            setSurvey: "surveys/setSurvey",
            setProjectBlocks: "projects/setProjectBlocks"
        }),
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
            if (this.survey.id === undefined) {
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
        createProject() {
            const payload = {
                accountToken: window.axios.defaults.headers["x-api-token"],
                name: this.title,
                description: this.description,
                surveyId: this.survey.id,
                projectId: this.title + "+" + this.survey.id,
                blocks: this.projectBlocks,
                comparisonData: this.comparisonData,
                hooked: false
            };
            this.createProject(payload);
            this.$router.push("projects");
        },
        downloadJSON() {
            let exportObj = [];
            const questions = this.survey.questions;

            for (let question in this.survey.questions) {
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
